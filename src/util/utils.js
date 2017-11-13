export const getParams = query => {
  if (!query) {
    return { };
  }

  return (query
    .split('?')[1]
    .split('&')
    .reduce((params, param) => {
      let [ key, value ] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, { }));
};

export const getOwner= team => {
  if (!team) {
    return { };
  }

  return (team
    .match(/\(([^)]+)\)/)[1]
  ) 
};

export const getTeamId = teampage => {
  if (!teampage) {
    return { };
  }

  return (teampage
    .split('&')[1]
    .split('=')[1]
  ) 
};

export const getPerc = (wins,losses) => {
  if (!wins || !losses) {
    return { };
  }

  return (((Number(wins)/(Number(wins) + Number(losses))) * 100).toFixed(2)
  ) 
};

export const removeDuplicates = (originalArray, prop) => {
  let newArray = [];
  let lookupObject  = {};

  for(let i in originalArray) {
     lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for(let i in lookupObject) {
      newArray.push(lookupObject[i]);
  }
   return newArray;
}