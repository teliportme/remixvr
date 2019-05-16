import { createContext } from 'react';
import { observable, decorate, action } from 'mobx';
import agent from '../agent';

class FieldStore {
  isSaving = false;

  createField(label, spaceId, data, file) {
    let formData = new FormData();
    formData.set('label', label);
    formData.set('space_id', spaceId);
    for (let [key, value] of Object.entries(data)) {
      formData.set(key, value);
    }
    if (file) {
      formData.append('file', file);
    }
    this.isSaving = true;
    return agent.Field.create(formData).finally(() => {
      this.isSaving = false;
    });
  }

  updateField(fieldId, data, file) {
    let formData = new FormData();
    for (let [key, value] of Object.entries(data)) {
      formData.set(key, value);
    }
    if (file) {
      formData.append('file', file);
    }
    this.isSaving = true;
    return agent.Field.edit(fieldId, formData).finally(() => {
      this.isSaving = false;
    });
  }
}

decorate(FieldStore, {
  isSaving: observable,
  createField: action
});

export const fieldStore = new FieldStore();

export default createContext(fieldStore);
