// เปิดใช้งาน http only cookie
axios.defaults.withCredentials = true
var modal = document.querySelector("#myModal");
var closeModal = document.querySelector("#closeModal");

var btnOk = document.querySelector("#btn-ok");
var btnCreate = document.querySelector("#btn-create");
var btnUpdate = document.querySelector("#btn-update");
var btnDelete = document.querySelector("#btn-delete");
var btnLogin = document.querySelector("#btn-login");
var btnLogout = document.querySelector("#btn-logout");

var lableUser = document.querySelector("#user");
var inputUsername = document.querySelector("#username");
var inputPassword = document.querySelector("#password");

var inputModalId = document.querySelector("#input-modal-id");
var inputModalUsername = document.querySelector("#input-modal-username");
var inputModalPassword = document.querySelector("#input-modal-password");
var dropdownRole = document.querySelector("#modal-role");

var modalHeader = document.querySelector("#modal-header");

const openModalCreate = ()=>{
    inputModalId.value="";
    dropdownRole.innerHTML=`<option value="admin">admin</option>
                            <option value="user" selected>user</option>`;
    inputModalUsername.value="";
    inputModalUsername.value="";
    modalHeader.innerHTML="create";
    modalHeader.value="create";
    modal.style.display = "block";

}

const openModalUpdate = (id)=>{
  modalHeader.innerHTML="update";
  modalHeader.value="update";
  modal.style.display = "block";
  readUserId(id);
}

const submit = () => {
  modal.style.display = "none";
  if(modalHeader.value ==="create"){
    createUser();
    return;
  }
  updateUser();
}

const cancel = () => {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const outTable = (row)=>{
  return `<table>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
              ${row}
            </table>`;
}
// เปิด tag เมื่อ ทำการเข้าสู่ระบบ
const authElement = (type)=>{
  // เมื่อเข้าสู่ระบบ
  if(type === 1){
    inputUsername.style.display="none";
    inputPassword.style.display="none";
    btnLogin.style.display="none";
    lableUser.style.display="block";
    btnCreate.style.display="block";
    btnLogout.style.display="block";
    return;
  }
  inputUsername.style.display="block";
  inputPassword.style.display="block";
  btnLogin.style.display="block";
  lableUser.style.display="none";
  btnCreate.style.display="none";
  btnLogout.style.display="none";
}

// เข้าสู่ระบบ
const authenticate = () => {
  let data = JSON.stringify({ username: inputUsername.value, password: inputPassword.value });
  let config = {
    method: "post",
    url: "http://127.0.0.1:8989/login",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then((res) => {
      // แสดง username
      let jsonRes = JSON.stringify(res.data); 
      let obj = JSON.parse(jsonRes);
      lableUser.innerHTML = `<label id="user">${obj.username}</label>`

      readUser();
      authElement(1);
    })
    .catch((error) => {
      console.log(error);
    });
  
  inputUsername.value="";
  inputPassword.value="";
};
 
const logOut = () =>{
  let config = {
    method: "post",
    url: "http://127.0.0.1:8989/logout",
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios(config)
  .then((res) => {
    authElement(0);
    document.querySelector("#datatable").innerHTML=`
      <table id="datatable">
        <tr>
          <th>Username</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </table>`;
  })
  .catch((error) => {
    console.log(error);
  });
}

const refresh = () =>{
  let config = {
    method: "post",
    url: "http://127.0.0.1:8989/refresh",
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios(config)
  .then((res) => {
    console.log(JSON.stringify(res.data));
  })
  .catch((error) => {
    console.log(error);
  });
}

const readUser = () => {
  let config = {
    method: 'get',
    url: 'http://127.0.0.1:8989/users',
  };
  
  axios(config)
  .then((res) => {
    // แปลง json เป็น string
    const response = JSON.stringify(res.data)
    // แปลง string เป็น object
    const objArr = JSON.parse(response);
    let row = "";
    for(var item of objArr){
        row += `<tr>
          <td>${item.username}</td>
          <td>${item.role}</td>
          <td><span class="btn-action">
              <input type = "button"  id = "btn-update"  class="btn-warning" value = "update" onclick = "openModalUpdate(${item.userId})"> 
              <input type = "button"  id = "btn-delete"  class="btn-danger" value = "delete" onclick = "deleteUser(${item.userId})"> 
              </span></td>
          </tr>`;
    }
    document.querySelector("#datatable").innerHTML= outTable(row);
  })
  .catch((error) => {
    console.log(error);
  });
};

const readUserId = (id) => {
  const role = ["admin", "user"];
  let config = {
    method: 'get',
    url: "http://127.0.0.1:8989/users/"+id,
  };
  
  axios(config)
  .then((res) => {
    // แปลง json เป็น string
    const response = JSON.stringify(res.data)
    // แปลง string เป็น object
    const obj = JSON.parse(response);
    inputModalId.value = obj.userId;
    inputModalUsername.value = obj.username;
    inputModalPassword.value = obj.password;
    let option = "";
    for(let i=0;i<role.length;i++){
      if(obj.role == role[i]){
        option += `<option value="${role[i]}" selected>${role[i]}</option>`;
      }else{
        option += `<option value="${role[i]}">${role[i]}</option>`;
      } 
    }
    dropdownRole.innerHTML = option;
  })
  .catch((error) => {
    console.log(error);
  });
};

const createUser = ()=>{
  let data = JSON.stringify({ username: inputModalUsername.value,
                              password: inputModalPassword.value,
                              role: dropdownRole.value });

  console.log(data);
  console.log("create");
  let config = {
    method: "post",
    url: "http://127.0.0.1:8989/users",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then((res) => {
      readUser();
    })
    .catch((error) => {
      console.log(error);
    });
}

const updateUser = ()=>{
  let data = JSON.stringify({ userId:parseInt(inputModalId.value),
                              username: inputModalUsername.value,
                              password: inputModalPassword.value,
                              role: dropdownRole.value });
  console.log(data);
  let config = {
    method: "put",
    url: "http://127.0.0.1:8989/users",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then((res) => {
      readUser();
    })
    .catch((error) => {
      console.log(error);
    });
}

const deleteUser = (id)=>{
  let isOk = confirm("Are you sure to delete?");
  console.log(isOk);
  if(isOk){
    let config = {
      method: 'delete',
      url: "http://127.0.0.1:8989/users/"+id,
    };
    
    axios(config)
    .then((res) => {
      readUser();
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

