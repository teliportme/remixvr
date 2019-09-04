import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class ClassroomStore {
  isLoading = false;
  classroomRegistry = new Map();

  // prettier-ignore
  get classrooms() {
    const classroomArray = [];
    for (let [key, value] of this.classroomRegistry) { // eslint-disable-line no-unused-vars
      classroomArray.push(value);
    }
    return classroomArray;
  }

  loadClassrooms() {
    this.isLoading = true;
    this.classroomRegistry.clear();
    return agent.Classroom.all()
      .then(({ classrooms }) => {
        classrooms.forEach(classroom => {
          this.classroomRegistry.set(classroom.slug, classroom);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  createClassroom(classname, subject, age_students) {
    return agent.Classroom.create(classname, subject, age_students).then(
      classroom => {
        this.classroomRegistry.set(classroom.slug, classroom);
        return classroom;
      }
    );
  }
}

decorate(ClassroomStore, {
  isLoading: observable,
  classroomRegistry: observable,
  classrooms: computed,
  loadClassrooms: action
});

export const classroomStore = new ClassroomStore();

export default createContext(classroomStore);
