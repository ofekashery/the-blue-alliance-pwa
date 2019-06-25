workflow "Build, test, and deploy" {
  on = "push"
  resolves = [
    "Deploy",
  ]
}

action "Install packages" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run build"
  secrets = ["FIREBASE_API_KEY", "FIREBASE_APP_ID", "FIREBASE_PROJECT_ID", "STACKDRIVER_API_KEY", "TBA_API_AUTH_KEY"]
  needs = ["Install packages"]
}

action "Lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install packages"]
  args = "run lint"
}

action "Test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "test"
  env = {
    CI = "true"
  }
  needs = ["Install packages"]
}

action "Send coverage reports to Codecov" {
  uses = "docker://node"
  needs = ["Test"]
  runs = "npx"
  args = "codecov"
  secrets = ["CODECOV_TOKEN"]
}

action "Deploy branch filter" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  needs = [
    "Build",
    "Lint",
    "Send coverage reports to Codecov",
  ]
  args = "branch master"
}

action "Authenticate Google Cloud" {
  uses = "actions/gcloud/auth@ba93088eb19c4a04638102a838312bb32de0b052"
  secrets = ["GCLOUD_AUTH"]
}

action "Deploy" {
  uses = "actions/gcloud/cli@ba93088eb19c4a04638102a838312bb32de0b052"
  needs = ["Deploy branch filter", "Authenticate Google Cloud"]
  args = "app deploy --project tbatv-prod-hrd --version 1 --quiet"
}
