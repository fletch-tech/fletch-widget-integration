// propTypes.js
const utils = {
    string: (value) => typeof value === 'string',
    number: (value) => typeof value === 'number',
    bool: (value) => typeof value === 'boolean',
    func: (func) => (value) => {
      if (typeof value !== 'object' || value === null) {
        return false;
      }
  
      for (const key in shape) {
        if (!func[key](value[key])) {
          return false;
        }
      }
  
      return true;
    },
    oneOfType: (types) => (value) => types.some((type) => type(value)),
  };
  
  export default propTypes;
  