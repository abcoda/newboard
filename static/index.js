document.addEventListener('DOMContentLoaded', () => {

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // draw state
    let draw = false;

    // elements
    let points = [];
    let lines = [];
    let svg = null;

    function updateServer(change, clear = false) {
        socket.emit('change made', { 'change': change, 'clear': clear });
    }

    socket.on('refresh board', change => {
        console.log(change)
        // for (let i = 0; i < board.length; i++) {
        //   svg.append(board[i])
        // }
        document.querySelector('#board').innerHTML += change
    });

    socket.on('clear board', () => {
        console.log('clear')
        // for (let i = 0; i < board.length; i++) {
        //   svg.append(board[i])
        // }
        document.querySelector('#board').innerHTML = ''
    });

    function render() {

        // create the selection area
        svg = d3.select('#board')
        // .attr('height', window.innerHeight)
        // .attr('width', window.innerWidth);

        svg.on('mousedown', function () {
            draw = true;
            const coords = d3.mouse(this);
            draw_point(coords[0], coords[1], false);
        });

        svg.on('touchstart', function () {
            draw = true;
            const coords = d3.mouse(this);
            draw_point(coords[0], coords[1], false);
        });

        svg.on('mouseup', () => {
            draw = false;
            // updateServer()
        });

        svg.on('touchend', () => {
            draw = false;
        })

        svg.on('mousemove', function () {
            if (!draw)
                return;
            const coords = d3.mouse(this);
            draw_point(coords[0], coords[1], true);
        });

        svg.on('touchmove', function () {
            if (!draw)
                return;
            const coords = d3.mouse(this);
            draw_point(coords[0], coords[1], true);
        });

        document.querySelector('#erase').onclick = () => {
            for (let i = 0; i < points.length; i++)
                points[i].remove();
            for (let i = 0; i < lines.length; i++)
                lines[i].remove();
            points = [];
            lines = [];
            document.querySelector("#board").innerHTML = ''
            updateServer(null, true)
        }

    }

    function draw_point(x, y, connect) {

        const color = document.querySelector('#color-picker').value;
        const thickness = document.querySelector('#thickness-picker').value;

        if (connect) {
            const last_point = points[points.length - 1];
            const line = svg.append('line')
                .attr('x1', last_point.attr('cx'))
                .attr('y1', last_point.attr('cy'))
                .attr('x2', x)
                .attr('y2', y)
                .attr('stroke-width', thickness * 2)
                .style('stroke', color);
            lines.push(line);
            updateServer(line['_groups'][0][0].outerHTML)
            // updateServer(line._groups[0][0])
        }

        const point = svg.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', thickness)
            .style('fill', color);
        points.push(point);
        // console.log(point)
        // console.log((point['_groups'][0][0].outerHTML))
        updateServer(point['_groups'][0][0].outerHTML)
    }

    render();
});
