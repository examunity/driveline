import loadable from '@loadable/component';

function lazy(ctor) {
  const Component = loadable(ctor, { suspense: true });

  Component.payload = {
    _result: ctor,
  };

  return Component;
}

export default lazy;
