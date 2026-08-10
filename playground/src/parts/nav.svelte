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

nav {
  padding: 0 1rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: stretch;
  background: white;
  box-shadow: 0 2px 4px rgb(black, 20%);
}

.left {
  h1 {
    font-weight: normal;
  }
}

.right {
  display: flex;
  flex-flow: row nowrap;
  justify-content: end;
  align-items: stretch;

  a {
    padding: 0 0.5em;
    color: black;
    font-size: 150%;

    &:hover, &:focus-visible {
      cursor: pointer;
      background: rgb(black, 4%);
    }
  }
}

</style>
