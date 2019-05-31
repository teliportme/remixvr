import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import PhotoSphere from '../components/fields/PhotoSphere';
import VideoSphere from '../components/fields/VideoSphere';
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

const FieldsGenerate = observer(({ fields, spaceId }) => {
  return fields.map(field => {
    if (field.type === 'photosphere') {
      return (
        <FieldWrapper key={field.id}>
          <PhotoSphere field={field} spaceId={spaceId} />
        </FieldWrapper>
      );
    } else if (field.type === 'text') {
      return (
        <FieldWrapper key={field.id}>
          <Text field={field} spaceId={spaceId} />
        </FieldWrapper>
      );
    } else if (field.type === 'videosphere') {
      return (
        <FieldWrapper key={field.id}>
          <VideoSphere field={field} spaceId={spaceId} />
        </FieldWrapper>
      );
    } else {
      return null;
    }
  });
});

export default FieldsGenerate;
