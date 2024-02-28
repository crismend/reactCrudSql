import React, { useState } from 'react'
import './App.css'
import axios from 'axios';
import Swal from 'sweetalert2'



const App = () => {

  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [pais, setPais] = useState('');
  const [cargo, setCargo] = useState('');
  const [anios, setAnios] = useState('');
  const [id, setId] = useState();

  const [editar, setEditar] = useState(false)

  const [empleados, setEmpleados] = useState([])


  //post
  const add = () => {
    if (!nombre || !edad || !pais || !cargo || !anios) {
      alert("Por favor, completa todos los campos");
      return; // Sale de la función si algún campo está vacío
    }
    axios.post("http://localhost:3001/create", {
      nombre,
      edad,
      pais,
      cargo, anios
    }).then(() => {
      // alert("empleado registrado")
      getEmpleados()
      limpiarCampos()
      Swal.fire({
        title: " <p>Registro Exitoso</p>",
        html: `<i>El empleado <strong>${nombre}</strong> fue registrado con exito</i>`,
        icon: "success",
        timer: 3000
      })
    })
  }

  //get
  const getEmpleados = () => {
    axios.get("http://localhost:3001/empleados").then((response) => {
      setEmpleados(response.data);
    })
  }
  getEmpleados();
  const editarEmpleado = (val) => {
    setEditar(true)
    setNombre(val.nombre)
    setEdad(val.edad)
    setPais(val.pais)
    setCargo(val.cargo)
    setAnios(val.anios)
    setId(val.id)
  }


  //update
  const update = () => {
    axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      // alert("Empleado actualizado")
      getEmpleados()
      limpiarCampos()
      setEditar(false)
      Swal.fire({
        title: " <p>Actualizacion Exitosa</p>",
        html: `<i>El empleado <strong>${nombre}</strong> fue Actualizado con exito</i>`,
        icon: "success",
        timer: 3000
      })
    })
  }

  //delete
  const deleteEmple = (val) => {

    Swal.fire({
      title: "Confirmar Eliminacion",
      html: `<i>Desea Eliminar a <strong>${val.nombre}</strong></i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si! Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
          // alert("Empleado actualizado")
          getEmpleados()
          limpiarCampos()
          setEditar(false)
          Swal.fire({
            icon: 'success',
            title: 'Tu usuario ha sido Eliminado!',
            showConfirmButton: false,
            timer: 2500
          });
        }).catch(function (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops....',
            text: 'No se logro eliminar el Empleado',
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ?
              "Intente mas tarde" : JSON.parse(JSON.stringify(error)).message
          });
        })
      }
    })
  }




  //limpiar campos
  const limpiarCampos = () => {
    setNombre('')
    setEdad('')
    setPais('')
    setCargo('')
    setAnios('')
    setId('')
    setEditar(false)
  }


  return (
    <div className="container">

      <div className="card text-center">
        <div className="card-header">
          GESTION DE EMPLEADOS
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre</span>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese un nombre"
              aria-label="Username"
              aria-describedby="basic-addon1"
              name='nombre' value={nombre} onChange={(event) => setNombre(event.target.value)}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad</span>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese su edad"
              aria-label="Username"
              aria-describedby="basic-addon1"
              name='edad' value={edad} onChange={(event) => setEdad(event.target.value)}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Pais</span>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese el pais"
              aria-label="Username"
              aria-describedby="basic-addon1"
              name='pais' value={pais} onChange={(event) => setPais(event.target.value)}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo</span>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese un cargo"
              aria-label="Username"
              aria-describedby="basic-addon1"
              name='cargo' value={cargo} onChange={(event) => setCargo(event.target.value)}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Años</span>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese los años"
              aria-label="Username"
              aria-describedby="basic-addon1"
              name='anios' value={anios} onChange={(event) => setAnios(event.target.value)}
            />
          </div>
        </div>
        <div className="card-footer text-body-secondary">

          {
            editar === true ?
              <div><button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
                <button className='btn btn-info' onClick={limpiarCampos}>cancelar</button>
              </div>
              :
              <button className='btn btn-success' onClick={add}>Registrar</button>
          }


        </div>
      </div>


      <table className="table table-striped">
        <thead>

          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">Pais</th>
            <th scope="col">Cargo</th>
            <th scope="col">Años</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {
            empleados.map((val) => (
              <tr key={val.id}>
                <th scope="row">{val.id}</th>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.pais}</td>
                <td>{val.cargo}</td>
                <td>{val.anios}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button onClick={() => editarEmpleado(val)} type="button" className="btn btn-info">Editar</button>
                    <button
                      onClick={() => {
                        deleteEmple(val)
                      }}
                      type="button" className="btn btn-danger">Eliminar</button>
                  </div>
                </td>
              </tr>
            )
            )
          }
        </tbody>
      </table>
    </div>
  )

}

export default App