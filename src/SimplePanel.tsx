import React from 'react';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import PowerCharts from 'fusioncharts/fusioncharts.powercharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { useTheme, stylesFactory } from '@grafana/ui';
import { PanelProps, getNamedColorPalette, getColorForTheme } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css } from 'emotion';
import { filterDataForSunburst } from './utils';
ReactFC.fcRoot(FusionCharts, PowerCharts, FusionTheme);
interface Props extends PanelProps<SimpleOptions> {}
export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const styles = getStyles();
  const palette = getThemePalette(theme);
  const dataSource = {
    chart: {
      showplotborder: '1',
      bgAlpha: '100',
      bgColor: theme.colors.bg1,
      paletteColors: palette.join(','),
      baseFont: theme.typography.fontFamily.monospace,
      baseFontSize: 12,
      baseFontColor: theme.palette.white,
      borderThickness: '0',
      toolTipColor: '#000000',
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
  // If there is data then render the sunburst chart.
  if (dataSource.data.length) {
    const colors = getColor(dataSource.data, palette);

    return (
      <div style={{ height, width }}>
        <ReactFC type="sunburst" height={height} width={width - 100} dataFormat="JSON" dataSource={dataSource} />
        <div className={styles.legends}>
          {dataSource.data.map(item => {
            return (
              <div className={styles.legendItem}>
                <div className={styles.colorBlock} style={{ backgroundColor: colors[item.id] }}></div>
                {item.name}: {item.value}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return <p className={styles.textCenter}>No data found</p>;
};
const getColor = (data, colorPlattets) => {
  const result = {};
  const parentItem = data.find(item => {
    return !item.parent;
  });
  const childrens = data
    .filter(item => {
      return item.parent === parentItem.id;
    })
    .sort((a, b) => Number(b.value) - Number(a.value));
  childrens.forEach((item, itemIndex) => {
    result[item.id] = colorPlattets[itemIndex + 1];
  });

  data.forEach((item, index) => {
    if (item.parent && !result[item.id]) {
      result[item.id] = result[item.parent];
    }
  });

  result[parentItem.id] = colorPlattets[0];

  return result;
};

const getStyles = stylesFactory(() => {
  return {
    textCenter: css`
      text-align: center;
    `,
    legends: css`
      position: absolute;
      right: 20px;
      top: 10%;
      font-size: 12px;
      font-family: monospace;
    `,
    colorBlock: css`
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin: 4px;
    `,
    legendItem: css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `,
  };
});
const getThemePalette = (theme: any): string[] => {
  const colors: string[] = [];
  for (let entry of getNamedColorPalette()) {
    colors.push(getColorForTheme(entry[1][0], theme.type));
  }
  return colors;
};
