def main [] {
  print "compiling..."
  try { tsc -p ./tsconfig.build.json }
  tsc-alias -p ./tsconfig.build.json
}

def "main full" [] {
  rm -rf dist
  main
  echo "built!"
}

def "main pre-publish" [] {
  print "publishing..."

  vitest run

  cd ../.autodoc
  rake
  cd ../desmost
  
  main full
  cp ../LICENCE LICENCE

  let dirty = git status --porcelain | find "/src/" | length
  
  if $dirty > 0 {
    print (ansi 'red')
    print $"Publish aborted!(ansi 'white')"
    print "Mate, you’ve got dirty changes uncommitted to Git!\n"

    exit 1
  }
}
