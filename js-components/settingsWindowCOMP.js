
class SettingsWindow {

    constructor() {

        this.settings = {
            
            changedState: false,
            set stateChanged(value) {

                if(this.changedState===false) {
                    
                    document.getElementById('save-settings-changes').classList.toggle('not-active');
                    document.getElementById('save-settings-changes').classList.toggle('active-button');
                    this.changedState = value;
                }
            },

            get stateChanged() {

                return this.changedState;
            },

            onStateChanged(e) {

                this.stateChanged = e.target.value;
            },

            onStateSaved() {

                document.getElementById('save-settings-changes').classList.toggle('not-active');
                document.getElementById('save-settings-changes').classList.toggle('active-button');
                this.changedState = false;
            }
        },

        this.template = `
        
        <div id='settings-window'>
            <div id='settings-window-header'>
                <img src='/img/@settings/settings.png'>
                <span>Налаштування</span>
            </div>
            <div id='settings-window-content'>

                <div class='block-avatar'>
                    <div onclick='settings_window.changeAvatarWindow()' class='block-avatar-img-container'>
                        <img id='block-user-avatar' class='block-avatar-img' src='/".$GLOBALS['myaccount_avatar']."'>
                        <div class='img-container-border'>
                           <img src='/img/@settings/photo-camera.png'>
                        </div>
                    </div>
                </div>

                <div class='block-nickname'>
                    <span>@".$GLOBALS['myaccount_login']."</span>
                </div>

                <div class='block-name'>
                    <span>Ім'я</span>
                    <input class='focus-blue' oninput='settings_window.settings.onStateChanged(event)' id='user-name' type='text' value=\"".$GLOBALS['myaccount_name']."\">
                    <span>Фамілія</span>
                    <input class='focus-blue' oninput='settings_window.settings.onStateChanged(event)' id='user-surname' type='text' value=\"".$GLOBALS['myaccount_surname']."\">
                </div>

                <div class='block-status'>
                    <span>Статус</span>
                    <input class='focus-blue' oninput='settings_window.settings.onStateChanged(event)' id='user-status' type='text' value=\"".$GLOBALS['myaccount_status']."\">
                </div>

                <div class='block-profession'>
                    <span>Професія</span>
                    <input class='focus-blue' oninput='settings_window.settings.onStateChanged(event)' id='user-profession' type='text' value=\"".$GLOBALS['myaccount_profession']."\">
                </div>

                <div class='block-about-me'>
                    <span>Про мене</span>
                    <textarea class='focus-blue' oninput='settings_window.settings.onStateChanged(event)' id='user-about-me'>".$GLOBALS['myaccount_about_me']."</textarea>
                </div>

                <div class='block-password'>
                    <span>Пароль</span>
                    <input readonly class='focus-blue' oninput='settings_window.settings.onStateChanged(event)' id='user-password' type='password' value=\"".$GLOBALS['myaccount_password']."\">
                </div>

                <button class='not-active' id='save-settings-changes' onclick='settings_window.saveSettingsChanges()'>Зберегти</button>
            
            </div>
            <div id='settings-window-bottom'></div>
        </div>
        
        `;
    }

    showCompleteBar() {
      
      let settings_window_content = document.getElementById('main-header');
      let complete_bar = document.createElement('div');
      complete_bar.id = 'complete-bar';
      settings_window_content.append(complete_bar);
      setTimeout(() => { complete_bar.remove() }, 1000);
    }

    changeAvatarWindow() {
         
        let avatar_window = document.createElement('div');
        avatar_window.id = 'change-avatar-window';
        avatar_window.innerHTML = ` 
        <div class='change-avatar-window-container'>
            <div class='caw-header'>
                <span>Оберіть аватарку</span>
            </div>
            <div class='caw-avatar-container'>
                <img id='caw-avatar-img' src='/".$GLOBALS['myaccount_avatar']."'>
                <input id='caw-avatar-img-input' type='file'>
                <div id='caw-avatar-img-shower'>
                    <img src='/img/@settings/photo-camera.png'>
                    <span>Ваша фотографія</span>
                </div>
            </div>
            <div class='caw-bottom'>
                <button onclick='settings_window.closeChangeAvatarWindow()' class='caw-cancel-button'>Відмінити</button>
                <button onclick='settings_window.updateAvatar()'class='caw-accept-button'>Зберегти</button>
            </div>
                    
        </div>`;
       
       document.getElementById('settings-window-content').append(avatar_window);

        document.getElementById('caw-avatar-img-shower').addEventListener('click', () => {

            document.getElementById('caw-avatar-img-input').click();

        });

        document.getElementById('caw-avatar-img-input').onchange = (e) => {

                console.log(e);
                var output = document.getElementById('caw-avatar-img');
                var avatar = document.getElementById('block-user-avatar');
                var user_avatar = document.getElementById('user-avatar');
                output.src = URL.createObjectURL(event.target.files[0]);
                avatar.src = URL.createObjectURL(event.target.files[0]);
                user_avatar.src = URL.createObjectURL(event.target.files[0]);
                output.onload = function() {
                    URL.revokeObjectURL(output.src); // free memory
                }
                avatar.onload = function() {
                    URL.revokeObjectURL(avatar.src); // free memory
                }
                user_avatar.onload = function() {
                    URL.revokeObjectURL(user_avatar.src); // free memory
                }
        }
      
    }
     
    closeChangeAvatarWindow() {

        document.getElementById('change-avatar-window').remove();
    }

    updateAvatar() {

       console.log('update avatar');
       let avatar_file = document.getElementById('caw-avatar-img-input');
       const formData = new FormData();
       formData.append('user_login', '".$GLOBALS['myaccount_login']."');
       formData.append('avatar', avatar_file.files[0]);   

       fetch('http://www.jsmanach.rf.gd/services/@settings/updateAvatar.php', {
            method: 'POST',
            mode: 'cors',
            body: formData
        }).then(result => result.text())
          .then(text => {

            console.log(text);
            settings_window.closeChangeAvatarWindow()
            settings_window.showCompleteBar();

           });
    }

    saveSettingsChanges() {

        console.log('start updating profile!');
        
        console.log(settings_window.settings.stateChanged);
        if(settings_window.settings.stateChanged===false) return;
        
        let myaccount_name = document.getElementById('user-name').value;
        let myaccount_surname = document.getElementById('user-surname').value;
        let myaccount_password = document.getElementById('user-password').value;
        let myaccount_profession = document.getElementById('user-profession').value;
        let myaccount_status = document.getElementById('user-status').value;
        let myaccount_about_me = document.getElementById('user-about-me').value;

       const formData = new FormData();
       formData.append('myaccount_id', '".$GLOBALS['myaccount_id']."');   
       formData.append('myaccount_name', myaccount_name);   
       formData.append('myaccount_surname', myaccount_surname); 
       formData.append('myaccount_password', myaccount_password);  
       formData.append('myaccount_profession', myaccount_profession);
       formData.append('myaccount_status', myaccount_status);   
       formData.append('myaccount_about_me', myaccount_about_me); 
    //    formData.append('thumbnail',mythumbnail.files[0]);   

       fetch('http://www.jsmanach.rf.gd/services/@settings/saveSettingsChanges.php', {
            method: 'POST',
            mode: 'cors',
        body: formData
        }).then(result => result.text())
          .then(text => {
             
            // document.getElementById('my-response').innerHTML = text;

            console.log(text);
            console.log('profile updated!');
            settings_window.showCompleteBar();
            settings_window.settings.onStateSaved();

           });
    }

    events() {


    }

    render() {
          
        let content =  document.getElementById('content').innerHTML;
        document.getElementById('content').innerHTML = content.replace('<settings-window></settings-window>', this.template);
        this.events();

    }
}

let settings_window = new SettingsWindow();
settings_window.render();
