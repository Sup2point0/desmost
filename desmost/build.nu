def main [] {
  try { tsc -p ./tsconfig.build.json }
  tsc-alias -p ./tsconfig.build.json
}

def "main full" [] {
  rm -rf dist
  main
  cp ../LICENCE LICENCE
  echo "built!"
}
