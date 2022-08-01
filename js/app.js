//variables y selectores 
const formulario = document.querySelector('#agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');

//eventos 
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);

    formulario.addEventListener('submit',agregarGasto);
}

//clases 

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = []
    }


    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad , 0  );
        this.restante = this.presupuesto - gastado ; 
    }

    eliminarGasto(id){ 
        this.gastos = this.gastos.filter( (gasto) => gasto.id !== id ); 

        this.calcularRestante();
    }
    
}

class UI{
    insertarPresupuesto( cantidad){
        //extraermos el valor 
        const {presupuesto , restante} = cantidad 

        //Los agregamos al html 
        document.querySelector('#total').textContent = presupuesto ;
        document.querySelector('#restante').textContent = restante ;
        
    }

    imprimirAlerta(mensaje, tipo){
        //crear el div 
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');

        }else{
            divMensaje.classList.add('alert-success');

        }
        //MENSAJE DE ERROR 
         divMensaje.textContent = mensaje 

         //insertar en el html 

         document.querySelector('.primario').insertBefore(divMensaje , formulario);
         
         setTimeout(()=> {
            divMensaje.remove();
         },3000 );
         
    }

    agregarGastoListado(gastos){
        
        //iterar sobre los gastos 

        this.limpiarHTML();

        gastos.forEach(gasto => {
            const {cantidad , nombre, id } = gasto; 

            //crear un li 
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id; /// agregamos un atributo personalizado en javascripts /// nuevoGasto.setAttribute('data-id', id); /// Esta era la forma antigua que se utilizaba antes en javascript 

            //agregar el html de gasto 
            nuevoGasto.innerHTML = `${nombre}
            <span class="badge badge-primary badge-pill">$ ${cantidad}</span>            
            `;

            //boton para borrar el gasto 
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;';
            btnBorrar.onclick = () => {
                eliminarGasto(id); 
            };
            nuevoGasto.appendChild(btnBorrar);

            // Insertar al HTML
            gastosListado.appendChild(nuevoGasto);
        });
        
        
        
    }

    limpiarHTML() {
        while(gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante ;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante }= presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        if ((presupuesto / 4 ) > restante ){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if ((presupuesto / 2 ) > restante ){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
            console.log('validando la condicion de 25 ')
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        // si el totla es 0 o menor 
        if(restante <= 0 ){
            ui.imprimirAlerta('El presupuesto se ha agotado ', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true ; 
        }
    }
}
//instanciar 
const ui = new UI();

let presupuesto ;
//funciones 

function preguntarPresupuesto() {
    const presupuestoUsiario = prompt('cual es tu presupuesto ' );
    //console.log( Number(presupuestoUsiario));
    if (presupuestoUsiario === '' || presupuestoUsiario === null || isNaN(presupuestoUsiario)|| presupuestoUsiario <= 0) {
        window.location.reload();
    }
    //presupuesto valido 
    presupuesto = new Presupuesto(presupuestoUsiario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

//añade gastos 
function agregarGasto(e){
    e.preventDefault();
// leemos los fdatos del formulario 
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar 
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('ambos campos son obligatorios ' , 'error');
        return ;
    }else if (cantidad <= 0 ||  isNaN(cantidad) ) {
        ui.imprimirAlerta('Cantidad no valida ' , 'error');
        return ; 
    }

    // generar un objeto con el gasto 
    const gasto = {nombre ,cantidad  , id : Date.now()} 

    //add nuevo gasto 

    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto agregado Correctamente')

    //imprimir los gastos 
    const {gastos , restante } = presupuesto;
    ui.agregarGastoListado(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    
    //reinicia formulario 
    formulario.reset()
    
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id); 
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos )
    ui.comprobarPresupuesto(presupuesto);
    ui.actualizarRestante(restante);

    
}
