<!-- @component `<Nav>` -->

<nav>
  <div class="left">
    <h1> Desmost <span>Playground</span> </h1>
  </div>

  <div class="right">
    <a target="_blank">npm</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost/tree/main/docs">Docs</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost">GitHub</a>
  </div>
</nav>


<style lang="scss">

$pad-vert: 0.25rem;
$font-size: 1.5rem;

nav {
  z-index: 1;
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
