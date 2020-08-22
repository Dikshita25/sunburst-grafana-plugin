/**
 * This function takes below and generate structured data for sunburst chart.
 * @param {*} dataTobeIterateOn 
 * @param {*} finalData 
 * @param {*} startIndex 
 * @param {*} endIndex 
 */
const createStructuredDataForSunburst = (
  dataTobeIterateOn: any,
  finalData: any,
  startIndex: any,
  endIndex: any
): any => {
  if (startIndex === endIndex) {
    return finalData;
  }

  const currentItem: any = {};

  dataTobeIterateOn.forEach((element: any) => {
    if (element.name == 'count') {
      currentItem.value = element.values.buffer[startIndex];
    } else {
      currentItem[element.name] = element.values.buffer[startIndex];
    }
  });

  startIndex++;

  finalData.push(currentItem);
  return createStructuredDataForSunburst(dataTobeIterateOn, finalData, startIndex, endIndex);
};

/**
 * This function takes data object from influxDB and passeds for required sunburnt chart supported format.
 * @param {*} data 
 */
export const filterDataForSunburst = (data: any) => {
  const allColumnsData = data.series.reduce((soFar: any, value: any) => {
    const nameSplit = value.name.split('.');
    const name = nameSplit.length === 2 ? nameSplit[1] : nameSplit[0];
    soFar.push({
      name: name,
      values: value.fields[1].values,
    });

    return soFar;
  }, []);

  const endIndex = allColumnsData.length ? allColumnsData[0].values.length - 1 : 0;
  return createStructuredDataForSunburst(allColumnsData, [], 0, endIndex);
};
