<!-- @component `<Nav>` -->

<nav>
  <div class="left">
    <h1> Desmost <span>Playground</span> &ensp; <small>by <a href="https://github.com/Sup2point0" target="_blank">Sup#2.0</a></small> </h1>
  </div>

  <div class="right">
    <a target="_blank">npm</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost/tree/main/docs">Docs</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost/blob/main/docs/writing/learn-x-in-y.md">Learn</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost">GitHub</a>
  </div>
</nav>


<style lang="scss">

$pad-vert: 0.5rem;
$font-size: 1.25rem;

nav {
  padding-right: 1rem;
  z-index: 10;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: stretch;

  @include font-ui;
  background: $col-deut;
  box-shadow: 0 2px 4px rgb(black, 20%);
}

.left {
  padding: $pad-vert 1.5rem;
  background: rgb(black, 20%);

  h1 {
    color: white;
    font-size: $font-size;
    font-weight: normal;

    small {
      color: rgb(white, 60%);
    }

    a {
      color: white;
      text-decoration: none;
    }
  }
}

.right {
  display: flex;
  flex-flow: row nowrap;
  justify-content: end;
  align-items: stretch;

  a {
    padding: $pad-vert 0.5em;
    font-size: $font-size;
    color: white;
    text-decoration: none;

    &:hover, &:focus-visible {
      cursor: pointer;
      background: rgb(black, 10%);
    }

    &:active {
      background: rgb(black, 25%);
    }
  }
}

</style>
