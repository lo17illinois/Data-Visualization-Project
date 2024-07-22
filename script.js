document.addEventListener("DOMContentLoaded", function() {
    // Function to handle tab switching
    function openPage(pageName, elmnt, color) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].style.backgroundColor = "";
        }
        document.getElementById(pageName).style.display = "block";
        elmnt.style.backgroundColor = color;
    }
    
    // Default open tab
    document.getElementById("defaultOpen").click();

    // Load data and create charts
    Promise.all([
        d3.csv("GDP_cleaned.csv"),
        d3.csv("Inbound_cleaned.csv")
    ]).then(function([gdpData, inboundData]) {
        createPage1Chart(gdpData, inboundData);
    });

    function createPage1Chart(gdpData, inboundData) {
        const svg = d3.select("#chart1")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "500px");

        const margin = { top: 20, right: 60, bottom: 30, left: 60 },
              width = svg.node().getBoundingClientRect().width - margin.left - margin.right,
              height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

        const x = d3.scaleTime().range([0, width]);
        const y0 = d3.scaleLinear().range([height, 0]);
        const y1 = d3.scaleLinear().range([height, 0]);

        const line1 = d3.line()
            .x(d => x(new Date(d.Date)))
            .y(d => y0(d.PrivateConsumption));

        const line2 = d3.line()
            .x(d => x(new Date(d.Date)))
            .y(d => y1(d.GrandTotal));

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x.domain(d3.extent(gdpData, d => new Date(d.Date)));
        y0.domain([0, d3.max(gdpData, d => +d.PrivateConsumption)]);
        y1.domain([0, d3.max(inboundData, d => +d.GrandTotal)]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y0")
            .call(d3.axisLeft(y0))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Private Consumption");

        g.append("g")
            .attr("class", "axis axis--y1")
            .attr("transform", `translate(${width},0)`)
            .call(d3.axisRight(y1))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", -20)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Grand Total");

        g.append("path")
            .datum(gdpData)
            .attr("class", "line")
            .attr("d", line1)
            .attr("stroke", "blue")
            .attr("fill", "none");

        g.append("path")
            .datum(inboundData)
            .attr("class", "line")
            .attr("d", line2)
            .attr("stroke", "red")
            .attr("fill", "none");
    }
});
