import React from 'react';
import ReactFC from 'react-fusioncharts';
import { useTheme } from '@grafana/ui';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import PowerCharts from 'fusioncharts/fusioncharts.powercharts';
import FusionCharts from 'fusioncharts'; // Include the chart type
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'; // Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, PowerCharts, FusionTheme); // STEP 2 - Chart Data

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
    console.log(element,'if elements displayed');
    } else {
      currentItem[element.name] = element.values.buffer[startIndex];
      console.log(element,'else elements displayed');
    }
  });
  startIndex++;
  finalData.push(currentItem);
  return createStructuredDataForSunburst(dataTobeIterateOn, finalData, startIndex, endIndex);
};
const filterDataForSunburst = (data: any) => {
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
  const finalData = createStructuredDataForSunburst(allColumnsData, [], 0, endIndex);
  return finalData;
};

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const jsonData = JSON.stringify(data);
  const dataSource = {
    chart: {
      //caption: 'Overview of Web',
      //subcaption: 'Click on the segments to Drill-down for region-wise population distribution',
      showplotborder: '1',
      theme: 'fusion',
      bgColor: theme.isLight ? '#FFFFFF' : '#000000'
    },
    data: filterDataForSunburst(data),
    styles: {
      definition: [
        {
          name: 'myHTMLFont',
          type: 'font',
          ishtml: '1',
        },
      ],
      application: [
        {
          toobject: 'TOOLTIP',
          styles: 'myHTMLFont',
        },
      ],
    },
  };
  if(dataSource.data.length) {
    return <ReactFC type="sunburst" width={width} height={height} dataFormat="JSON" dataSource={dataSource} />;
  }
  return <p>'No data found'</p>
};
