import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { verifyKaggleCredentials } from "../build/utils/kaggle-api.js";

test("accepts KAGGLE_USERNAME + KAGGLE_KEY from env", async () => {
  process.env.KAGGLE_USERNAME = "user";
  process.env.KAGGLE_KEY = "key";
  assert.equal(await verifyKaggleCredentials(), true);
});

test("throws a helpful error when no credentials are configured", async () => {
  delete process.env.KAGGLE_USERNAME;
  delete process.env.KAGGLE_KEY;
  const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), "kaggle-home-"));
  const original = os.homedir;
  os.homedir = () => fakeHome;
  try {
    await assert.rejects(verifyKaggleCredentials(), /credentials not found/);
  } finally {
    os.homedir = original;
  }
});
