const fs = require('fs');

// Read data from JSON file
const rawData = fs.readFileSync('heartrate.json');
const data = JSON.parse(rawData);

// Organize data by date
const dateData = {};
data.forEach(entry => {
    const date = entry.timestamps.startTime.slice(0, 10);
    if (!dateData[date]) {
        dateData[date] = {
            bpmValues: [],
            timestamps: []
        };
    }
    dateData[date].bpmValues.push(entry.beatsPerMinute);
    dateData[date].timestamps.push(entry.timestamps.endTime);
});

// Calculate statistics and prepare output
const output = Object.keys(dateData).map(date => {
    const bpmValues = dateData[date].bpmValues;
    const timestamps = dateData[date].timestamps;

    const minBPM = Math.min(...bpmValues);
    const maxBPM = Math.max(...bpmValues);
    const medianBPM = calculateMedian(bpmValues);
    const maxTimestamp = new Date(Math.max(...timestamps.map(timestamp => new Date(timestamp)))).toISOString();
    const latestTimestamp = maxTimestamp !== 'Invalid Date' ? maxTimestamp : null;

    return {
        date,
        min: minBPM,
        max: maxBPM,
        median: medianBPM,
        latestDataTimestamp: latestTimestamp
    };
});

// Write output to a file
fs.writeFileSync('output.json', JSON.stringify(output, null, 2));

console.log('Output written to "output.json"');

// Function to calculate median
function calculateMedian(values) {
    const sortedValues = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(sortedValues.length / 2);
    if (sortedValues.length % 2 === 0) {
        return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
    } else {
        return sortedValues[middle];
    }
}