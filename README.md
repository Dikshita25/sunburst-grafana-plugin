# Grafana Panel Plugin Template

<!-- 
[![CircleCI](https://circleci.com/gh/grafana/simple-react-panel.svg?style=svg)](https://circleci.com/gh/grafana/simple-react-panel)
[![David Dependency Status](https://david-dm.org/grafana/simple-react-panel.svg)](https://david-dm.org/grafana/simple-react-panel)
[![David Dev Dependency Status](https://david-dm.org/grafana/simple-react-panel/dev-status.svg)](https://david-dm.org/grafana/simple-react-panel/?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/grafana/simple-react-panel/badge.svg)](https://snyk.io/test/github/grafana/simple-react-panel)
[![Maintainability](https://api.codeclimate.com/v1/badges/1dee2585eb412f913cbb/maintainability)](https://codeclimate.com/github/grafana/simple-react-panel/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1dee2585eb412f913cbb/test_coverage)](https://codeclimate.com/github/grafana/simple-react-panel/test_coverage) -->

This template is a starting point for building Grafana Panel Plugins in Grafana 7.0+


## What is Grafana Panel Plugin?
Panels are the building blocks of Grafana. They allow you to visualize data in different ways. While Grafana has several types of panels already built-in, you can also build your own panel, to add support for other visualizations.

For more information about panels, refer to the documentation on [Panels](https://grafana.com/docs/grafana/latest/features/panels/panels/)

## Getting started
1. Install dependencies
```BASH
yarn install
```
2. Build plugin in development mode or run in watch mode
```BASH
yarn dev
```
or
```BASH
yarn watch
```
3. Build plugin in production mode
```BASH
yarn build
```

## How to structure/format data for sunburst graphs?
Understanding on how to the structure data is of the most difficult part while plotting any kind of graphs. We will now see how to import the data into the influxdb to plot a sunburst graph.
Here's a example, which we will further understand:

```[
  {
    "id": "0.0",
    "parent": "",
    "name": "The World",
    "value": 7542011839
  },
  {
    "id": "1.3",
    "parent": "0.0",
    "name": "Asia",
    "value": 4503248822
  },
  {
    "id": "1.1",
    "parent": "0.0",
    "name": "Africa",
    "value": 1256268025
  },
  {
    "id": "1.2",
    "parent": "0.0",
    "name": "America",
    "value": 1006801064
  },
  {
    "id": "1.4",
    "parent": "0.0",
    "name": "Europe",
    "value": 743253404
  }
]
```

The first id, in this case i.e '0.0' be the parent or center of the graph, having some count(value) and some other parameters in form of name , parent etc.
```
{
  "id": "0.0",
  "parent": "",
  "name": "The World",
  "value": 7542011839
}
```
**Note:** The center or the parent won't have any parent linked to it, hence has a empty value in it

Now, lets move to its children, which are items having names with Asia, Africa, Europe, America having similar structure as the first one, but with parent = '0.0' which is ideally the id of the parent. So yes, that's the way we link the children with the parent. And you may further link the level-2 children with level-1 and go on...
Here's the reference of the sunburst chart

![Sunburst chart](https://res.cloudinary.com/dtliuizjh/image/upload/v1598199576/sunburstchart_a1xetd.png)

### Now, lets see how to query the data on Grafana dashboard after importing the above data into the database
So the above chart can be used using the time-filter in-order to plot, so just add a panel. Select the sunburst graph and add the query. Something like:
`` Select * from <Measurement>``
**Note:** Format to be used should be "Time series"
And there you go, having your data to be plotted in sunburst style.
We have used fusion charts to plot the sunburst graph you may further change the style depending on the need or requirement for more reference, refer to the[Fusion charts](https://www.fusioncharts.com/charts/sunburst-charts/simple-sunburst-chart?framework=javascript).

Thanks for reading!!

## Learn more
- [Build a panel plugin tutorial](https://grafana.com/tutorials/build-a-panel-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System
