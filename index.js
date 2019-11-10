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

d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
)
  .then(json => {
    console.log('json :', json);
    //seconds, year
    const scaleX = d3
      .scaleTime()
      .domain([
        d3.min(json, d => {
          // console.log('d.Year :', d.Year);
          return d.Year - 1;
        }),
        d3.max(json, d => {
          return d.Year + 1;
        })
      ])
      .range([0, width]);
    const scaleY = d3
      .scaleLinear()
      .domain([
        d3.min(json, d => {
          return d.Seconds / 60;
        }),
        d3.max(json, d => {
          return d.Seconds / 60;
        })
      ])
      .range([0, height]);

    const axisX = d3.axisBottom(scaleX).tickFormat(d3.format('d'));
    // const axisX = d3.axisBottom(scaleX).tickFormat(d3.time.format('%a %d'));
    const formatTime = d3.timeFormat('%M:%S');
    const axisY = d3.axisLeft(scaleY).tickFormat(formatTime);

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
      .attr('fill', 'red')
      .attr('r', '4px')
      .attr('data-xvalue', d => {
        const newDate = new Date(d.Year, 0);

        return newDate;
      })
      .attr('data-yvalue', d => {
        const minutes = Math.floor(d.Seconds / 60);
        const seconds = d.Seconds % 60;
        // const time = d.Time;
        // console.log('minutes :', minutes);
        // console.log('seconds :', seconds);
        // console.log('time :', time);
        // const formatMinute = d3.timeFormat('%M:%S');
        const newDateObj = new Date(1970, 0, 1, 0, minutes, seconds);
        console.log('newDateObj :', newDateObj);

        return minutes;
      })
      .attr('cx', d => scaleX(d.Year) + margin.left)
      .attr('cy', d => scaleY(d.Seconds / 60) + margin.top);
  })
  .catch(err => {
    console.error(err);
  });
