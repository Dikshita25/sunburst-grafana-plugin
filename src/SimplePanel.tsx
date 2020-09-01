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
    return <ReactFC type="sunburst" width={width} height={height} dataFormat="JSON" dataSource={dataSource} />;
  }

  return <p className={styles.textCenter}>No data found</p>;
};

const getStyles = stylesFactory(() => {
  return {
    textCenter: css`
      text-align: center;
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
