import loadable from '@loadable/component';

function lazy(ctor) {
  return loadable(ctor, { suspense: true });
}

export default lazy;
