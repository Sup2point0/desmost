export function* reversing<T>(items: ArrayLike<T>): Generator<T>
{
  for (let i = items.length - 1; i >= 0; i--) {
    yield items[i];
  }
}

export function paired<T>(items: Iterable<T>): Array<[left: T, right: T]>
{
  return pairing(items).toArray();
}

export function* pairing<T>(items: Iterable<T>): Generator<[left: T, right: T]>
{
  let previous = null;

  for (let item of items) {
    if (previous === null) {
      previous = item;
      continue;
    }
    else {
      yield [previous, item];
      previous = null;
    }
  }

  if (previous !== null) {
    return previous;
  }
}
