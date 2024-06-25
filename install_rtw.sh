#!/usr/bin/env bash

function downloadPackage() {
    PACKAGE_NAME=$1
    DOMAIN=roanuz
    REPOSITORY=dev # Later pass this as an argument once rtw went to prod. Keep the repository name what we have in aws. Check in aws Developer Tools -> CodeArtifact -> Repositories
    DOMAIN_OWNER=`aws sts get-caller-identity --query Account --output text`
    LATEST_PACKAGE_VERSION=`aws codeartifact list-package-versions --package $PACKAGE_NAME --domain $DOMAIN --domain-owner $DOMAIN_OWNER --repository $DOMAIN --format pypi --output text --query 'versions[-1:].version'`
    REPO=`aws codeartifact get-repository-endpoint --domain $DOMAIN --repository $REPOSITORY --format pypi  --output text`
    REPO=${REPO#https://}
    AUTH_TOKEN_RESPONSE=`aws codeartifact get-authorization-token --domain $DOMAIN --output text`
    AUTH_TOKEN=$(echo $AUTH_TOKEN_RESPONSE | awk '{print $1}')
    INDEX_URL="https://aws:${AUTH_TOKEN}@${REPO}simple/"
    pip install $PACKAGE_NAME==$LATEST_PACKAGE_VERSION --index-url $INDEX_URL --extra-index-url https://pypi.org/simple
}


args=("$@")

# Initialize variables
auto_yes=false

# Check for -y flag and extract aws_profile
for arg in "${args[@]}"; do
  if [ "$arg" == "-y" ]; then
    auto_yes=true
  elif [ -z "$AWS_PROFILE" ]; then
    AWS_PROFILE="$arg"
  fi
done


if [ -z "$VIRTUAL_ENV" ]; then
  if [ "$auto_yes" = false ]; then
    echo "Warning: You are not in a Python virtual environment."
    echo "You may want to create one using the steps listed in the RTW docs."
    read -p "Do you still want to proceed? (y/N): " user_input
    user_input=$(echo "$user_input" | tr '[:upper:]' '[:lower:]')
    if [[ "$user_input" != "y" && "$user_input" != "yes" ]]; then
      echo "Script execution cancelled."
      exit 1
    fi
  fi
fi

downloadPackage rtw
downloadPackage orjson
