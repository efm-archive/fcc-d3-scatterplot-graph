// Margin Convention as per https://bl.ocks.org/mbostock/3019563

const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const bodySvg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

bodySvg
  .append('text')
  .attr('id', 'title')
  .attr('x', width / 2)
  .attr('y', -20)
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .style('font-family', 'sans-serif')
  .text(
    'FCC D3 Data Visualization Projects - Visualize Data with a Scatterplot Graph'
  );

const scaleX = d3.scaleLinear().range([0, width]);
const scaleY = d3.scaleTime().range([height, 0]);

const timeParse = d3.timeParse('%M:%S');
const timeFormat = d3.timeFormat('%M:%S');

const axisX = d3.axisBottom(scaleX).tickFormat(d3.format('d'));
const axisY = d3.axisLeft(scaleY).tickFormat(timeFormat);

const tooltipDiv = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

const tooltipDivFlex = d3
  .select('#tooltip')
  .append('div')
  .attr('id', 'tooltipFlex');

const legendDiv = d3
  .select('body')
  .append('div')
  .attr('id', 'legend');

const legendDivDoper = d3
  .select('#legend')
  .append('div')
  .attr('id', 'dopedLegend')
  .style('color', 'red')
  .html(`Doper`);

const legendDivNonDoper = d3
  .select('#legend')
  .append('div')
  .attr('id', 'noDopedLegend')
  .style('color', 'yellowgreen')
  .html(`NonDoper`);

d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
)
  .then(json => {
    // console.log('json :', json);

    scaleX.domain([
      d3.min(json, d => {
        return d.Year - 1;
      }),
      d3.max(json, d => {
        return d.Year + 1;
      })
    ]);
    scaleY.domain(
      d3.extent(json, d => {
        return d3.timeParse('%M:%S')(d.Time);
      })
    );

    bodySvg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axisX);

    bodySvg
      .append('g')
      .attr('id', 'y-axis')
      .call(axisY);

    const dot = d3
      .select('svg')
      .selectAll('circle')
      .data(json)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('fill', d => {
        if (!d.Doping.length) {
          return 'yellowgreen';
        }
        return 'red';
        // return new Date(d.Year, 0);
      })
      .attr('r', '4px')
      .attr('data-xvalue', d => {
        // return new Date(d.Year, 0);
        return d.Year;
      })
      .attr('data-yvalue', d => {
        const formattedMinute = d3
          .timeParse('%M:%S')(d.Time)
          .toISOString();
        // console.log('formattedMinute :', formattedMinute);
        return formattedMinute;
      })
      .attr('cx', d => scaleX(d.Year) + margin.left)
      .attr('cy', (d, i) => {
        // console.log('d :', i, d);
        // const formattedMinute = d3.timeParse('%M:%S')(d.Time);
        const formattedMinute = timeParse(d.Time);
        return scaleY(formattedMinute) + margin.top;
      })
      .on('mouseover', d => {
        // console.log('d :', d);
        // console.log('d3.event :', d3.event);
        // console.log('d3.event.pageX :', d3.event.pageX);
        // console.log('d3.event.pageY :', d3.event.pageY);
        tooltipDiv
          .style('left', d3.event.pageX + 10 + 'px')
          .style('top', d3.event.pageY + 10 + 'px')
          .attr('data-year', d.Year);

        tooltipDivFlex
          .style('font-size', '14px')
          .style('font-family', 'sans-serif')
          .html('Time: ' + d.Time + '<br/>Year: ' + d.Year);
        tooltipDiv
          .transition()
          .duration(50)
          .style('opacity', 0.8);
      })
      .on('mouseout', d => {
        tooltipDiv
          .transition()
          .duration(600)
          .style('opacity', 0);
      });
  })
  .catch(err => {
    console.error(err);
  });
