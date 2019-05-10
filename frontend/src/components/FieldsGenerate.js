import React from 'react';
import { observer } from 'mobx-react-lite';
import PhotoSphere from '../components/fields/PhotoSphere';

// https://stackoverflow.com/a/27267762/1291535
function flatten(ary) {
  var ret = [];
  for (var i = 0; i < ary.length; i++) {
    if (Array.isArray(ary[i].children)) {
      ret = ret.concat(flatten(ary[i].children));
      ret.push(ary[i]);
    } else {
      ret.push(ary[i]);
    }
  }
  return ret;
}

const FieldsGenerate = observer(({ config }) => {
  const space = config.spaces[0];
  const fields = space.fields;
  var fieldsFlat = flatten(fields);
  console.log(fieldsFlat);
  return fieldsFlat.map(field => {
    if (field.type === 'photosphere') {
      return <PhotoSphere />;
    }
  });
});

export default FieldsGenerate;
