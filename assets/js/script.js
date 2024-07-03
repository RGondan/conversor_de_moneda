const api_url = 'https://mindicador.cl/api/'

let res_json;
let datos_moneda = [];
let chart;
const formato_fecha = {year: 'numeric', moth:'long', day: 'numeric'}


document.querySelector('body').onload = async function(){
    const res = await fetch(api_url);
    res_json = await res.json();
    getMonedas();
}

function getMonedas(){
    let monedas = '<option value="none">Seleccione moneda</option>';
    const keys = Object.keys(res_json);

    keys.forEach(element => {
        let elemento = res_json[element]
        if (Object.keys(elemento).includes('unidad_medida') && elemento.unidad_medida != 'Porcentaje'){
            monedas += `<option value=${element}>${elemento.nombre}</option>`;
        }
    });
    document.getElementById('monedas').innerHTML = monedas;
}

document.getElementById('buscar').onclick = function(){
    const clp = document.getElementById('clp').value
    const moneda = document.getElementById('monedas').value
    const valor = res_json[moneda].valor
    console.log(valor)
    let total = '...'
    if (valor != 'none' && Number(clp) > 0){
        total = (clp/valor).toFixed(2)
    }
    document.getElementById('resultado').innerText = 'Resultado: $' + total
    createChart(moneda)
}

async function createChart(moneda) {
    if(!(chart === undefined)){
        chart.destroy()
    }
    const res = await fetch(api_url+moneda)
    const data =  await res.json()
    const dates = data.serie.slice(0,10).reverse()
    chart = new Chart(
        document.getElementById('chart_display'),
        {
            type: 'line',
            data: {
                labels: dates.map(row => new Date(row.fecha).toLocaleDateString('es-CL')),
                datasets: [
                    {
                        label: 'Historial últimos 10 días',
                        data: dates.map(row => row.valor)
                    }
                ]
            }
        }
    )
}