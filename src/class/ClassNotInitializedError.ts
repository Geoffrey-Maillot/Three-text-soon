/**
 * Custom error thrown when attempting to use a class that hasn't been properly initialized
 * @extends Error
 */
class ClassNotInitializedError extends Error {
  /**
   * Creates a new ClassNotInitializedError
   * @param {string} className - The name of the class that wasn't initialized
   */
  constructor(className: string) {
    super('Class must be initialized with createClass before using it');
    this.name = className + 'NotInitializedError';
  }
}

export { ClassNotInitializedError };
