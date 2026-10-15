"""Contract checks for the executable composer and distributable references."""

import importlib.util
import json
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("uiux", ROOT / "tools/uiux.py")
uiux = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(uiux)


class ComposerTests(unittest.TestCase):
    def run_cli(self, *args):
        return subprocess.run(
            [sys.executable, str(ROOT / "tools/uiux.py"), *map(str, args)],
            capture_output=True, text=True, encoding="utf-8", check=False,
        )

    def test_all_modes_and_platforms_compose_with_task_and_checks(self):
        brief = uiux.load_brief(ROOT / "examples/saas-brief.json")
        for mode in uiux.MODES:
            for platform in uiux.PLATFORMS:
                with self.subTest(mode=mode, platform=platform):
                    result = uiux.compose(brief, mode, platform)
                    self.assertIn(brief["primary_task"], result)
                    self.assertIn(f"Mode: {mode}. Platform: {platform}.", result)
                    self.assertIn(uiux.read(f"references/platform-{platform}.md"), result)
                    self.assertIn(uiux.read("references/quality.md"), result)

    def test_compact_preserves_platform_and_quality_with_less_context(self):
        brief = uiux.load_brief(ROOT / "examples/mobile-brief.json")
        full = uiux.compose(brief)
        compact = uiux.compose(brief, compact=True)
        self.assertLess(len(compact), len(full))
        self.assertIn(uiux.read("references/platform-mobile.md"), compact)
        self.assertIn(uiux.read("references/quality.md"), compact)

    def test_output_refuses_overwrite_and_preserves_existing_bytes(self):
        with tempfile.TemporaryDirectory() as folder:
            destination = Path(folder) / "prompt.md"
            destination.write_bytes(b"existing work\n")
            result = self.run_cli("bundle", "--brief", ROOT / "examples/saas-brief.json", "--output", destination)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(destination.read_bytes(), b"existing work\n")
            self.assertEqual(result.stdout, "")

    def test_stdout_matches_created_utf8_bundle(self):
        with tempfile.TemporaryDirectory() as folder:
            destination = Path(folder) / "prompt.md"
            args = ("bundle", "--brief", ROOT / "examples/desktop-brief.json")
            printed = self.run_cli(*args)
            saved = self.run_cli(*args, "--output", destination)
            self.assertEqual(printed.returncode, 0, printed.stderr)
            self.assertEqual(saved.returncode, 0, saved.stderr)
            self.assertEqual(printed.stdout, destination.read_text(encoding="utf-8"))
            self.assertIn("Cutroom", printed.stdout)

    def test_bad_briefs_fail_without_output(self):
        invalid = ("{", "[]", '{"product":"Only a title"}',
                   '{"product":"x","audience":"y","primary_task":false}',
                   '{"product":"x","audience":"y","primary_task":"z","platform":"tv"}')
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / "brief.json"
            for value in invalid:
                with self.subTest(value=value):
                    source.write_text(value, encoding="utf-8")
                    result = self.run_cli("bundle", "--brief", source)
                    self.assertEqual(result.returncode, 2)
                    self.assertEqual(result.stdout, "")
                    self.assertNotIn("Traceback", result.stderr)

    def test_unknown_fields_and_unicode_are_preserved(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / "brief.json"
            data = {"product": "Mtaa — café", "audience": "Local makers", "primary_task": "Book", "custom": {"locale": "sw-KE"}}
            source.write_text(json.dumps(data), encoding="utf-8")
            result = self.run_cli("bundle", "--brief", source, "--compact")
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("Mtaa — café", result.stdout)
            self.assertIn('"locale": "sw-KE"', result.stdout)

    def test_audit_and_role_scope_are_explicit(self):
        brief = uiux.load_brief(ROOT / "examples/saas-brief.json")
        result = uiux.compose(brief, mode="audit", role="experience-reviewer")
        self.assertIn(uiux.MODES["audit"], result)
        self.assertIn("Act as the experience reviewer", result)

    def test_resource_filter_excludes_other_kinds(self):
        catalog = json.loads((ROOT / "resources/catalog.json").read_text(encoding="utf-8"))
        result = self.run_cli("resources", "--kind", "template")
        self.assertEqual(result.returncode, 0, result.stderr)
        for resource in catalog["resources"]:
            if resource["kind"] == "template":
                self.assertIn(resource["url"], result.stdout)
            else:
                self.assertNotIn(resource["url"], result.stdout)


class DistributionTests(unittest.TestCase):
    def test_relative_markdown_links_resolve(self):
        for source in ROOT.rglob("*.md"):
            if any(part.startswith(".") for part in source.relative_to(ROOT).parts):
                continue
            for target in re.findall(r"\[[^\]]*\]\(([^\s)]+)\)", source.read_text(encoding="utf-8")):
                if "://" in target or target.startswith("#"):
                    continue
                with self.subTest(source=source, target=target):
                    self.assertTrue((source.parent / target.split("#")[0]).exists())

    def test_examples_and_brief_template_are_usable(self):
        for source in [*ROOT.glob("examples/*-brief.json"), ROOT / "templates/brief.json"]:
            with self.subTest(source=source):
                brief = uiux.load_brief(source)
                self.assertTrue(uiux.compose(brief))

    def test_catalog_is_actionable_and_dates_are_parseable(self):
        from datetime import date

        catalog = json.loads((ROOT / "resources/catalog.json").read_text(encoding="utf-8"))
        date.fromisoformat(catalog["reviewed"])
        seen = set()
        for item in catalog["resources"]:
            with self.subTest(item=item["name"]):
                self.assertTrue(item["url"].startswith("https://"))
                self.assertNotIn(item["url"], seen)
                seen.add(item["url"])
                self.assertTrue(item["fit"] and item["caution"])
                if item["kind"] == "template":
                    self.assertTrue(item["license_url"].startswith("https://"))
                    self.assertTrue(item["stated_license"])


if __name__ == "__main__":
    unittest.main()
