class ClassNotInitializedError extends Error {
  constructor(className: string) {
    super('Class must be initialized with createClass before using it');
    this.name = className + 'NotInitializedError';
  }
}

export { ClassNotInitializedError };
