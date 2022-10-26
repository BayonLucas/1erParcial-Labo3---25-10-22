const setError = (input, mensaje) =>{
    const $small = input.nextElementSibling;
    $small.textContent = mensaje || `${input.name} requerido`;
    input.classList.add("inputError");
}    
const clearError = (input) =>{
    const $small = input.nextElementSibling;
    $small.textContent = "";
    input.classList.remove("inputError");
}    
const validarLogitudMinima = (input, minimo) =>{
    return input.value.trim().length >= minimo;
}
const validarLogitud = (input, min, max) =>{
    const text = input.value.trim();
    return (text.length >= min && text.length <= max);
}
    

        


// regexr.com //Pagina de reguladores de expresiones
export const validarEmail = (e) =>{
    const input = e.target;
    const pattern = /^([a-zA-Z0-9\.]+@+[a-zA-Z]+(\.)+[a-zA-Z]{2,3})$/igm;
    const email = input.value.trim();
    
    if(email.length >6){
        !pattern.test(email) ? setError(input, "Campo Requerido") : clearError(input);
    }
}

export const validarPassword = (e) =>{
    const input = e.target;
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    const password = input.value.trim();
    
    if(!validarLogitudMinima(input, 8)){
        setError(input, "Debe contener minimo 8 caracteres");
    }
    else{
        !pattern.test(password) ? setError(input, "Debe contener al menos una mayuscula, una minuscula, un numero y un caracter especial") : clearError(input);

    }
}

export const validarImportes = (e) =>{
    const input = e.target;
    const value = input.value;
    ((isNaN(value)) && value>50000 && value<0)? setError(input, "Solo se admiten caracteres numericos") : clearError(input);
}

export const validarTexto = (e) =>{
    const input = e.target;
    if(!validarLogitud(input, 4, 25)){
        setError(input, "El campo debe contener entre 4 y 25 caracteres.");
    }
    else{
        clearError(input);
    }
}

export const validarCampoVacio = (e) =>{
    const input = e.target;
    const value = input.value.trim();
    if(!value){
        setError(input);
    
    }else{
        clearError(input);
    }    
}

export const validarSelectVacio = (e) => {
    const input = e.target;
    if(input.value === "-1"){
        setError(input);
    
    }else{
        clearError(input);
    }  
}



export const validarExtencion = (e) =>{
    const extenciones = ["gif", "jpg", "png", "jpeg"];
    const input = e.target;
    const nombre = input.files[0].name;
    const ext = nombre.split(".").pop();

    extenciones.includes(ext)? clearError(input) : setError(input, "Archivo invalido");
}