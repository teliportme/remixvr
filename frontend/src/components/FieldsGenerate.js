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

const FieldsGenerate = observer(({ fields }) => {
  return fields.map(field => {
    if (field.type === 'photosphere') {
      return <PhotoSphere key={field.id} field={field} />;
    } else {
      return null;
    }
  });
});

export default FieldsGenerate;
