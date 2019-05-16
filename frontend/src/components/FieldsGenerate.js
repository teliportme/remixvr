import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import PhotoSphere from '../components/fields/PhotoSphere';
import Text from '../components/fields/Text';

// https://stackoverflow.com/a/27267762/1291535
// function flatten(ary) {
//   var ret = [];
//   for (var i = 0; i < ary.length; i++) {
//     if (Array.isArray(ary[i].children)) {
//       ret = ret.concat(flatten(ary[i].children));
//       ret.push(ary[i]);
//     } else {
//       ret.push(ary[i]);
//     }
//   }
//   return ret;
// }

const FieldWrapper = styled.div.attrs({
  className: 'mv2'
})``;

const FieldsGenerate = observer(({ fields }) => {
  return fields.map(field => {
    if (field.type === 'photosphere') {
      return (
        <FieldWrapper key={field.id}>
          <PhotoSphere field={field} />
        </FieldWrapper>
      );
    } else if (field.type === 'text') {
      return (
        <FieldWrapper key={field.id}>
          <Text field={field} />
        </FieldWrapper>
      );
    } else {
      return null;
    }
  });
});

export default FieldsGenerate;
