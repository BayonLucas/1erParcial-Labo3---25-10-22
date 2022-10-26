import Anuncio_Animal from "./Anuncio_Animal.js";
import {crearTabla} from "./tablaDinamica.js";
import {validarCampoVacio, validarTexto, validarImportes, validarSelectVacio} from "./validaciones.js";

const formulario = document.forms[0]; 
const controles = formulario.elements;
const btnGuardar = document.getElementById("btnGuardar");
const listaAnuncios = localStorage.getItem("anuncios")? JSON.parse(localStorage.getItem("anuncios")) : []; 
const tabla = document.getElementById("tabla-container");
let falgBtn = 0;

window.addEventListener("load", () => {
    localStorage.getItem("anuncios")? JSON.parse(localStorage.getItem("anuncios")) : localStorage.setItem("anuncios", JSON.stringify([]));
    actualizarTabla(listaAnuncios);
});




//Aplico validaciones
for(let i = 0; i < controles.length; i++){
    const control = controles.item(i);
    if(control.matches("input")){
        if(control.matches("[type=text]") || control.matches("[type=date]")){
            control.addEventListener("blur", validarCampoVacio);
            if(control.matches("[id=txtPrecio]") || control.matches("[id=dateRaza]") || control.matches("[id=dateFecha]") || control.matches("[id=sltVacunas]")){
                control.addEventListener("input", validarImportes);
            }
            else{
                control.addEventListener("blur", validarTexto);
            }
        }
    }
    else{
        control.addEventListener("blur", validarSelectVacio);
    }
}



function getEspecie(Perro, Gato){
    let ret;
    if(Perro.checked){
        ret = Perro.value;
    } else {
        ret = Gato.value;
    }
    return ret;
}
function getNewAnuncioId(arr){
    let id = 0;
    if(arr.length != 0){
        id = arr[arr.length-1].id + 1;
    }
    return id;
}
function isCompleted(txtTitulo, txtDescripcion, txtPrecio, txtRaza, dateFecha, sltVacunas){
    let ret = true;
    if(txtTitulo.value == "" || txtDescripcion.value == "" || txtPrecio.value == "" || txtRaza.value == "" || dateFecha.value == "" || sltVacunas.value == "-1"){
        ret = false;
    }
    return ret;
}
function limpiarInputs(){
    const {txtTitulo, txtDescripcion, txtPrecio, txtRaza, dateFecha, sltVacunas} = controles;
    txtTitulo.value = "";
    txtDescripcion.value = "";
    txtPrecio.value = "";
    txtRaza.value = "";
    dateFecha.value = "";
    sltVacunas.value = "-1";
}
function agregarAnuncio(auxAnuncio){
    const $small = btnGuardar.nextSibling;
    listaAnuncios.push(auxAnuncio);
    playSpinner(listaAnuncios);

}
//Guardar Anuncio
btnGuardar.addEventListener("click", () => {
    const $small = btnGuardar.nextSibling;
    const { txtTitulo, chPerro, chGato, txtDescripcion, txtPrecio, txtRaza, dateFecha, sltVacunas} = controles;  
    let especie = getEspecie(chPerro, chGato);
    let id = getNewAnuncioId(listaAnuncios);

    if(isCompleted(txtTitulo, txtDescripcion, txtPrecio, txtRaza, dateFecha, sltVacunas)){
        let auxAnuncio = new Anuncio_Animal(id, txtTitulo.value, especie, txtDescripcion.value, txtPrecio.value, txtRaza.value, dateFecha.value, sltVacunas.value);           
        agregarAnuncio(auxAnuncio);
    }else{
        $small.textContent = "Error en la carga del anuncio";
        
    }
});



function actualizarTabla(lista) {
    const container = document.getElementById("tabla-container");
    if(container.children.length > 0 && lista.length > 0){
        const table = crearTabla(lista);
        container.removeChild(container.children[0]);
        container.appendChild(table);
    } else if (lista.length > 0){
        const table = crearTabla(lista);
        container.appendChild(table);
    }     
}

//modificacion 
tabla.addEventListener("click", (e) => {
  const emisor = e.target;

  if (emisor.matches("tbody tr td")) {
    let id = emisor.parentElement.dataset.id;
    const anuncio = listaAnuncios.find((element) => element.id == id);
    completarForm(anuncio);
    //agregar botones
    modificarBotones();

  }
});

function completarForm(anuncio){
    const {txtTitulo, chPerro, chGato, txtDescripcion, txtPrecio, txtRaza, dateFecha, sltVacunas} = controles;
    if(anuncio.especie === "Perro"){
        chPerro.checked = true;
    } else {
        chGato.checked = true;
    }
    txtTitulo.value = anuncio.titulo;
    txtDescripcion.value = anuncio.descripcion;
    txtPrecio.value = anuncio.precio;
    txtRaza.value = anuncio.especie;
    dateFecha.value = anuncio.fechaNacimiento;
    console.log(anuncio.vacunas);
    switch(anuncio.vacunas){
        case "Si":
            sltVacunas.value = 1;
            break;
        case "No":
            sltVacunas.value = 0 ;
            break;
    }
}

function modificarBotones(){
    if(falgBtn === 0){
        const divBotones = document.getElementById("buttons-container");
        
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.id = "btnEliminar";
        
        const btnCancelar = document.createElement("button");
        btnCancelar.textContent = "Cancelar";
        btnCancelar.id = "btnCancelar";
        
        btnGuardar.textContent = "Modificar";
        btnGuardar.id = "btnModificar";
    
        divBotones.appendChild(btnEliminar);
        divBotones.appendChild(btnCancelar);
    
        btnCancelar.addEventListener("click", () =>{
            btnGuardar.textContent = "Guardar";
            btnGuardar.id = "btnGuardar";
            btnCancelar.remove();
            btnEliminar.remove();
            limpiarInputs();
            falgBtn = 0;    
        });

        btnEliminar.addEventListener("click", (e) =>{
            btnCancelar.click();
            falgBtn = 0;    

        })

        document.getElementById("btnModificar").addEventListener("click", () => {
            
            ModificarAnuncio()
            btnCancelar.click();
        });
        falgBtn = 1;
    }
}



function ModificarAnuncio(id){
    const auxLista = listaAnuncios.filter((element) => element.id !== Number(id));
    const { txtTitulo, chPerro, chGato, txtDescripcion, txtPrecio, txtRaza, dateFecha, sltVacunas} = controles;  
    let especie = getEspecie(chPerro, chGato);

    let auxAnuncio = new Anuncio_Animal(id, txtTitulo.value, especie, txtDescripcion.value, txtPrecio.value, txtRaza.value, dateFecha.value, sltVacunas.value);    

    auxLista.push(auxAnuncio);
    localStorage.setItem("anuncios", JSON.stringify(auxLista));
    actualizarTabla(auxLista);

}



function playSpinner(listaAnuncios) {
    const spinner = document.getElementById("spinner");
    spinner.classList.add("visible");
    spinner.classList.remove("notVisible");
    const $small = btnGuardar.nextSibling;

    setTimeout(() => {
      spinner.classList.remove("visible");
      spinner.classList.add("notVisible");
      actualizarTabla(listaAnuncios);
      localStorage.setItem("anuncios", JSON.stringify(listaAnuncios));
      $small.textContent = "";
      limpiarInputs();
    }, 3000);
}



