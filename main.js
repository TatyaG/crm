(async function () {

    let clients = [];
    let contactsArray = [];
    let timer;
    const clientList = document.getElementById('clients-list');

    function addPreload() {
        clientList.classList.add('preload')
    }

    function removePreload() {
        clientList.classList.remove('preload')
    }


    const search = document.querySelector('.header__input');


    async function searchClients() {
        const response = await fetch(`http://localhost:3000/api/clients?search=${search.value}`, {
            method: 'GET',
        });
        const data = await response.json();
        if (data == '') {
            const message = document.createElement('span');
            message.textContent = 'Ничего не найдено';
            message.classList.add('message');
            document.querySelector('.clients__btn-block').prepend(message)
        }
        return data;
    }

    async function getClientInfo(id) {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'GET',
        });
        const data = await response.json();
        responseError(response, data)
        return data;
    }


    async function addClients(obj) {
        const response = await fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        responseError(response, data)
        return data;
    }

    async function deleteClients(id) {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    }

    async function changeClients(obj, id) {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)

        })
        const data = await response.json();
        responseError(response, data)

        return data;
    }

    function responseError(response, data) {
        if (document.querySelector('.server-message') !== null) document.querySelector('.server-message').remove();

        if (response.status >= 400) {
            const errorMessage = document.createElement('span');
            errorMessage.classList.add('server-message');
            document.querySelector('.form__btn').prepend(errorMessage);

            if (response.status === 422) {
                for (const error of data.errors) {
                    const message = error.message;
                    errorMessage.textContent = message;
                }
                return
            }

            if (response.status === 404) {
                const message = data.message
                errorMessage.textContent = message;
                return
            }

            if (response.status >= 500) {
                const message = data.message
                errorMessage.textContent = message;
                return
            }

            else errorMessage.textContent = 'Что-то пошло не так...';

        }
    }


    function getFio(arr) {
        let clients = [...arr]
        for (let client of clients) {
            client.fio = `${client.surname} ${client.name} ${client.lastName}`;
        }
    }

    function getDate(date) {
        const dt = new Date(date);
        let day = dt.getDate();
        let month = dt.getMonth() + 1;
        let year = dt.getFullYear();

        if (month.toString().length == 1) {
            month = "0" + month
        }
        if (day.toString().length == 1) {
            day = "0" + day
        }

        return `${day}.${month}.${year}`
    }

    function getTime(date) {
        const dt = new Date(date);
        let hours = dt.getHours();
        let minutes = dt.getMinutes();

        if (hours.toString().length == 1) {
            hours = "0" + hours
        }

        if (minutes.toString().length == 1) {
            minutes = "0" + minutes
        }

        return `${hours}:${minutes}`
    }

    function createModal(id, obj) {
        const modal = document.createElement('div');
        const modalOverlay = document.createElement('div');
        const modalWindow = document.createElement('div');
        const modalHeader = document.createElement('div');
        const modalTitle = document.createElement('h3');
        const modalCloseBtn = document.createElement('button');
        const form = document.createElement('form');
        const formContent = document.createElement('div');
        const formLabelSurname = document.createElement('label');
        const formInputSurname = document.createElement('input');
        const placeholderSurname = document.createElement('span');

        const formLabelName = document.createElement('label');
        const formInputName = document.createElement('input');
        const placeholderName = document.createElement('span');

        const formLabelLastname = document.createElement('label');
        const formInputLastname = document.createElement('input');
        const placeholderLastname = document.createElement('span');

        const formContacts = document.createElement('div');
        const contacts = document.createElement('div');
        const addContactBtn = document.createElement('button');
        const addContactBtnContent = document.createElement('span');
        const btnBlock = document.createElement('div');
        const btnSave = document.createElement('button');
        const btnCancel = document.createElement('button');

        btnSave.type = 'submit'
        btnCancel.type = 'button'

        modal.classList.add('modal');
        modalOverlay.classList.add('modal__overlay');
        modalWindow.classList.add('modal__window');
        modalHeader.classList.add('modal__header');
        modalTitle.classList.add('modal__title');
        modalCloseBtn.classList.add('modal__btn');

        form.classList.add('form');
        formContent.classList.add('form__content');
        formLabelSurname.classList.add('form__label');
        formInputSurname.classList.add('form__input');
        placeholderSurname.classList.add('placeholder-surname');

        formLabelName.classList.add('form__label');
        formInputName.classList.add('form__input');
        placeholderName.classList.add('placeholder-name');

        formLabelLastname.classList.add('form__label');
        formInputLastname.classList.add('form__input');

        formContacts.classList.add('form__contacts');
        contacts.classList.add('contacts')

        addContactBtn.classList.add('form__btn-add');
        addContactBtnContent.classList.add('form__btn-add__content');
        btnBlock.classList.add('form__btn', 'error')
        btnSave.classList.add('form__btn--save');
        btnCancel.classList.add('form__btn--cancel');

        btnSave.textContent = 'Сохранить';
        addContactBtnContent.textContent = 'Добавить контакт';
        placeholderSurname.textContent = '*';
        placeholderName.textContent = '*';

        formInputSurname.type = 'text';
        formInputName.type = 'text';
        formInputLastname.type = 'text';



        if (id == 'modal-new') {
            modal.id = 'modal-new';
            modalCloseBtn.id = 'close-new';
            form.id = 'form-add';
            formInputSurname.id = 'surname';
            formInputName.id = 'name';
            formInputLastname.id = 'lastname';
            addContactBtn.id = 'btn-new';
            contacts.classList.add('contacts-new');
            btnSave.id = 'save-new';
            btnCancel.id = 'cancel-new';
            modalTitle.textContent = 'Новый клиент';
            btnCancel.textContent = 'Отмена';
            formInputSurname.placeholder = 'Фамилия';
            formInputName.placeholder = 'Имя';
            formInputLastname.placeholder = 'Отчество';
            formInputSurname.addEventListener('input', () => {
                if (formInputSurname.value !== '') placeholderSurname.style.display = 'none';
                else placeholderSurname.style.display = 'inline'
            })

            formInputName.addEventListener('input', () => {
                if (formInputName.value !== '') placeholderName.style.display = 'none';
                else placeholderName.style.display = 'inline'
            })


            btnCancel.addEventListener('click', (e) => {
                e.preventDefault();
                modal.remove()

            })


            form.addEventListener('submit', (e) => {
                if (document.querySelector('.server-message') !== null) document.querySelector('.server-message').remove()
                e.preventDefault();
                contactsArray = [];
                let obj = {
                    name: document.getElementById('name').value,
                    surname: document.getElementById('surname').value,
                    lastName: document.getElementById('lastname').value,
                    contacts: contactsArray
                }
                addContacts();

                validator.onSuccess(() => {
                    if (validationDropdown(this) == true) {
                        // e.target.reset();
                        validator.refresh()
                        let resp = addClients(obj);
                        resp.then(resp => {
                            clientList.append(addNewClient(resp));
                            clients.push(resp)
                            getFio(clients)
                            document.getElementById('modal-new').remove();
                            // document.querySelector('.placeholder-surname').style.display = 'inline';
                            // document.querySelector('.placeholder-name').style.display = 'inline';
                        })
                            .catch(err => console.log(err))
                    }

                })
            })
        }


        if (id == 'modal-change') {
            modal.id = 'modal-change';
            modalCloseBtn.id = 'close-change';
            form.id = 'form-change';
            formInputSurname.id = 'surname-change';
            formInputName.id = 'name-change';
            formInputLastname.id = 'lastname-change';
            addContactBtn.id = 'btn-change';
            contacts.classList.add('contacts-change');
            btnSave.id = 'save-change';
            btnCancel.id = 'cancel-change';
            modalTitle.textContent = 'Изменить данные';
            btnCancel.textContent = 'Удалить клиента';
            const id = document.createElement('span');
            id.classList.add('id-change');
            modalHeader.append(id);
            formLabelSurname.textContent = 'Фамилия';
            formLabelName.textContent = 'Имя';
            formLabelLastname.textContent = 'Отчество';
            formLabelSurname.classList.add('label-change');
            formLabelName.classList.add('label-change');
            formLabelLastname.classList.add('label-change');


            form.addEventListener('submit', (e) => {
                e.preventDefault();
                validator.onSuccess(() => {
                    if (validationDropdown(this) == true) {
                        if (document.querySelector('.error-message') !== null) document.querySelector('.error-message').remove()
                        changeClient(obj);
                    }

                })
            })
        }




        modal.append(modalOverlay);
        modalOverlay.append(modalWindow);
        modalWindow.append(modalHeader);
        modalWindow.append(form);
        modalHeader.prepend(modalTitle);
        modalHeader.append(modalCloseBtn);
        btnBlock.append(btnSave, btnCancel);
        form.append(formContent, formContacts, btnBlock);
        formContent.append(formLabelSurname, formLabelName, formLabelLastname);
        formLabelSurname.append(formInputSurname, placeholderSurname);
        formLabelName.append(formInputName, placeholderName);
        formLabelLastname.append(formInputLastname, placeholderLastname);
        formContacts.append(contacts, addContactBtn);
        addContactBtn.append(addContactBtnContent);



        const validator = validation(form);


        validator.addField(formInputSurname, [
            {
                rule: 'required',
                errorMessage: 'Введите фамилию',
            },
            {
                rule: 'minLength',
                value: 3,
                errorMessage: 'Фамилия должна содержать минимум 3 символа',
            },
        ])
            .addField(formInputName, [
                {
                    rule: 'required',
                    errorMessage: 'Введите имя',
                },
                {
                    rule: 'minLength',
                    value: 3,
                    errorMessage: 'Имя должно содержать минимум 3 символа',
                },
            ])


        document.body.append(modal);


        modalCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove()
        }
        );

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modal.remove()
            }
        })

        addContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const contactBlock = document.querySelectorAll('.contact');
            const addContact = document.querySelector('.contacts')
            addContact.append(addNewContact());
            if (contactBlock.length === 9) {
                addContactBtnContent.style.display = 'none';
            }

            const contacts = document.querySelectorAll('.contact');


        })


        return modal
    }


    function validation(form) {
        const validator = new JustValidate(form, {
            errorLabelCssClass: ['error-message'],
            errorLabelStyle: {
                color: '#F06A4D',
            },
            lockForm: true,
        });

        return validator;
    }



    function createModalDelete(obj, tr) {
        const modal = document.createElement('div');
        const modalOverlay = document.createElement('div');
        const modalWindow = document.createElement('div');
        const modalHeader = document.createElement('div');
        const modalBody = document.createElement('div');
        const modalTitle = document.createElement('h3');
        const modalClose = document.createElement('button');
        const modalText = document.createElement('p');
        const deleteBtn = document.createElement('button');
        const modalCancel = document.createElement('button');

        modal.id = 'modal-delete';
        modal.classList.add('modal');
        modalOverlay.classList.add('modal__overlay');
        modalWindow.classList.add('modal__window');
        modalHeader.classList.add('modal__header');
        modalBody.classList.add('modal__body');
        modalTitle.classList.add('modal__title', 'delete-title');
        modalClose.classList.add('modal__btn');
        modalText.classList.add('modal__text');
        deleteBtn.classList.add('delete-btn');
        modalCancel.classList.add('modal__cancel');

        modalTitle.textContent = 'Удалить клиента';
        modalText.innerHTML = 'Вы действительно хотите удалить данного клиента?';
        deleteBtn.textContent = 'Удалить';
        modalCancel.textContent = 'Отмена';


        modal.append(modalOverlay);
        modalOverlay.append(modalWindow);
        modalWindow.append(modalHeader);
        modalWindow.append(modalBody);
        modalHeader.append(modalTitle);
        modalHeader.append(modalClose);
        modalBody.append(modalText, deleteBtn, modalCancel);

        document.body.append(modal);

        modalClose.addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
        })

        modalCancel.addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
        })

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modal.remove();
            }
        })

        deleteBtn.addEventListener('click', () => {
            deleteClient(obj, tr);
            // modal.remove();
            if (document.getElementById('modal-change') !== null)
                document.getElementById('modal-change').remove()
        })

        return modal;
    }



    const addClientBtn = document.querySelector('.clients__btn');

    addClientBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const modalNew = createModal('modal-new');
        modalNew.classList.add('modal--open');
    })



    function addNewContact() {

        const contactList = document.createElement('ul'),
            contactItem = document.createElement('li'),
            contactBtn = document.createElement('button'),
            contactDropdown = document.createElement('ul'),
            contactDropdownItemTel = document.createElement('li'),
            contactDropdownLinkEmail = document.createElement('a'),
            contactDropdownLinkTel = document.createElement('a'),
            contactDropdownLinkFacebook = document.createElement('a'),
            contactDropdownLinkVk = document.createElement('a'),
            contactDropdownLinkOther = document.createElement('a'),
            contactDropdownItemEmail = document.createElement('li'),
            contactDropdownItemFacebook = document.createElement('li'),
            contactDropdownItemVk = document.createElement('li'),
            contactDropdownItemOther = document.createElement('li'),
            contactBlock = document.createElement('div'),
            input = document.createElement('input'),
            label = document.createElement('label')


        contactBtn.type = 'button'
        contactDropdownLinkTel.textContent = 'Телефон';
        contactDropdownLinkEmail.textContent = 'Email';
        contactDropdownLinkFacebook.textContent = 'Facebook';
        contactDropdownLinkVk.textContent = 'Vk';
        contactDropdownLinkOther.textContent = 'Другое'
        contactBtn.textContent = 'Выберите'


        contactList.classList.add('contact__list')
        contactItem.classList.add('contact__item')
        contactBtn.classList.add('contact__type')
        contactDropdown.classList.add('dropdown')
        contactDropdownItemTel.classList.add('dropdown__item')
        contactDropdownItemEmail.classList.add('dropdown__item')
        contactDropdownItemFacebook.classList.add('dropdown__item')
        contactDropdownItemVk.classList.add('dropdown__item')
        contactDropdownItemOther.classList.add('dropdown__item')
        contactDropdownLinkTel.classList.add('dropdown__link')
        contactDropdownLinkEmail.classList.add('dropdown__link')
        contactDropdownLinkFacebook.classList.add('dropdown__link')
        contactDropdownLinkVk.classList.add('dropdown__link')
        contactDropdownLinkOther.classList.add('dropdown__link')


        contactList.append(contactItem)
        contactItem.append(contactBtn)
        contactItem.append(contactDropdown)
        contactDropdown.append(contactDropdownItemTel)
        contactDropdown.append(contactDropdownItemEmail)
        contactDropdownItemEmail.append(contactDropdownLinkEmail)
        contactDropdownItemTel.append(contactDropdownLinkTel)
        contactDropdownItemFacebook.append(contactDropdownLinkFacebook)
        contactDropdownItemVk.append(contactDropdownLinkVk)
        contactDropdownItemOther.append(contactDropdownLinkOther)
        contactDropdown.append(contactDropdownItemFacebook)
        contactDropdown.append(contactDropdownItemVk)
        contactDropdown.append(contactDropdownItemOther)


        input.classList.add('contact__input');
        contactBlock.classList.add('contact');
        label.classList.add('contact__label')

        contactBlock.append(label)
        contactBlock.prepend(contactList)
        label.append(input);

        input.disabled = false

        if (contactBtn.textContent === 'Выберите') input.disabled = true
        else input.disabled = false



        contactDropdown.childNodes.forEach(item => {
            item.addEventListener('click', () => {
                input.disabled = false
                contactBtn.textContent = item.textContent;
                input.placeholder = ''
                if (contactBtn.textContent === 'Телефон') {
                    input.type = 'number';
                }
                if (contactBtn.textContent === 'Email') {
                    input.type = 'email';
                    input.placeholder = 'Введите данные'
                }
                if (contactBtn.textContent === 'Facebook') {
                    input.type = 'text';
                    input.placeholder = 'https://facebook.com/';
                }
                if (contactBtn.textContent === 'Vk') {
                    input.type = 'text';
                    input.placeholder = 'https://vk.com/';
                }
                if (contactBtn.textContent === 'Другое') {
                    input.type = 'text';
                    input.placeholder = 'Введите данные'
                }

            })
        })

        const validator = validation(document.querySelector('.form'))

        validator.addField(input, [

            {
                rule: 'required',
                errorMessage: 'Введите контакт',
            },
        ])


        contactBtn.addEventListener('click', (e) => {
            document.querySelectorAll('.contact__item').forEach(item => {
                if (item.querySelector('.contact__type') !== contactBtn) {
                    item.classList.remove('contact__item-open')
                }

            })
            e.isClick = true;
            contactBtn.parentElement.classList.toggle('contact__item-open')
        })

        document.body.addEventListener('click', (e) => {
            if (e.isClick == true ||
                e.target.classList.contains('contact__type') == true ||
                e.target.classList.contains('dropdown') == true) return

            document.querySelectorAll('.contact__item').forEach(item => {
                item.classList.remove('contact__item-open')
            })
        })

        return contactBlock;
    }


    function validationDropdown(form) {
        let result = true;
        const contactType = document.querySelectorAll('.contact__type');
        contactType.forEach(type => {
            if (type.textContent === 'Выберите') result = false;
        })
        return result;
    }



    function addNewClient(client) {
        const clientTr = document.createElement('tr'),
            clientId = document.createElement('td'),
            clientFio = document.createElement('td'),
            clientDateCreate = document.createElement('td'),
            dateCreate = document.createElement('span'),
            timeCreate = document.createElement('span'),
            clientDateChange = document.createElement('td'),
            createBlock = document.createElement('div'),
            changeBlock = document.createElement('div'),
            dateChange = document.createElement('span'),
            timeChange = document.createElement('span'),
            clientContacts = document.createElement('td'),
            contactList = document.createElement('ul'),
            clientActions = document.createElement('td'),
            actionsBlock = document.createElement('div'),
            changeBtnContent = document.createElement('span'),
            deleteBtnContent = document.createElement('span'),
            clientChangeBtn = document.createElement('button'),
            clientDeleteBtn = document.createElement('button')

        clientId.textContent = client.id;
        clientFio.textContent = `${client.surname} ${client.name} ${client.lastName}`;
        dateCreate.textContent = getDate(client.updatedAt);
        timeCreate.textContent = getTime(client.updatedAt);
        dateChange.textContent = getDate(client.createdAt);
        timeChange.textContent = getTime(client.createdAt);
        deleteBtnContent.textContent = 'Удалить';
        clientChangeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7" clip-path="url(#clip0_224_2496)">
        <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873FF"/>
        </g>
        <defs>
        <clipPath id="clip0_224_2496">
        <rect width="16" height="16" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        Изменить
        `

        createBlock.classList.add('date-block')
        changeBlock.classList.add('date-block')
        dateCreate.classList.add('date')
        dateChange.classList.add('date')
        timeCreate.classList.add('time')
        timeChange.classList.add('time')
        actionsBlock.classList.add('actions-block')
        clientId.classList.add('client-id')
        changeBtnContent.classList.add('change-btn-content')
        deleteBtnContent.classList.add('delete-btn-content')
        contactList.classList.add('client-contact')
        clientChangeBtn.classList.add('change-btn')
        clientChangeBtn.append(changeBtnContent)
        clientDeleteBtn.append(deleteBtnContent)
        clientTr.append(clientId);
        clientTr.append(clientFio);

        createBlock.append(dateCreate)
        createBlock.append(timeCreate)
        clientDateCreate.append(createBlock);

        changeBlock.append(dateChange)
        changeBlock.append(timeChange)
        clientDateChange.append(changeBlock);

        clientTr.append(clientDateCreate);
        clientTr.append(clientDateChange);
        clientContacts.append(contactList);
        clientTr.append(clientContacts);
        actionsBlock.append(clientChangeBtn);
        actionsBlock.append(clientDeleteBtn);
        clientActions.append(actionsBlock);
        clientTr.append(clientActions);


        clientChangeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalChange = createModal('modal-change', client);
            modalChange.classList.add('modal--open');
            openClientInfo(client.id);

            document.getElementById('cancel-change').addEventListener('click', (e) => {
                e.preventDefault();
                const modalDelete = createModalDelete(client, clientTr);
                modalDelete.classList.add('modal--open');

            })

        })


        for (let contact of client.contacts) {
            const contactItem = document.createElement('li');
            const contactLink = document.createElement('a');
            contactItem.classList.add('client-contact__item');
            contactItem.append(contactLink);
            contactList.append(contactItem);

            contactItem.append(createTooltip(contact.type, contact.value))
            if (contact.type == 'Телефон') {
                contactLink.href = `tel: ${contact.value}`
                contactLink.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                <circle cx="8" cy="8" r="8" fill="#9873FF"/>
                <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
                </g>
                </svg>
                `
            };

            if (contact.type == 'Другое') {
                contactLink.href = `${contact.value}`;
                contactLink.target = '_blank';
                contactLink.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
                </svg>
                `
            }
            if (contact.type == 'Email') {
                contactLink.href = `mailto: ${contact.value}`;
                contactLink.target = '_blank';
                contactLink.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
                </svg>`
            }
            if (contact.type == 'Vk') {
                contactLink.href = `${contact.value}`;
                contactLink.target = '_blank';

                contactLink.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
                </g>
                </svg>`
            }
            if (contact.type == 'Facebook') {
                contactLink.href = `${contact.value}`;
                contactLink.target = '_blank';
                contactLink.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
                </g>
                </svg>
                `
            }
        }


        clientDeleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalDelete = createModalDelete(client, clientTr)
            modalDelete.classList.add('modal--open');

        })

        return clientTr;
    }


    function deleteClient(obj, tr) {
        let resp = deleteClients(obj.id);
        resp.then(answ => {
            document.getElementById('modal-delete').remove()
            answ.message ? alert(answ.message) : tr.remove();
            let index = clients.findIndex(el => el.id === obj.id);
            clients.splice(index, 1);
        })
            .catch(err => console.log(err))
    }


    function changeClient(obj) {
        let contacts = [];
        let clientItem = {};

        clientItem.name = document.getElementById('name-change').value;
        clientItem.surname = document.getElementById('surname-change').value;
        clientItem.lastName = document.getElementById('lastname-change').value;
        clientItem.contacts = contacts;
        clientItem.id = obj.id;

        const contactValues = document.querySelectorAll('.contact__input');
        const contactTypes = document.querySelectorAll('.contact__type')


        for (let i = 0; i < contactValues.length; i++) {
            contacts.push({
                type: contactTypes[i].textContent,
                value: contactValues[i].value
            })

        }

        let resp = changeClients(clientItem, obj.id);
        resp.then(resp => {
            const index = clients.findIndex(client => client.id === obj.id);
            clients.splice(index, 1, resp);
            renderClients();
            document.getElementById('modal-change').remove();
        })
            .catch(err => console.log(err))
    }


    function openClientInfo(id) {
        let resp = getClientInfo(id);
        resp.then(resp => {
            document.getElementById('surname-change').value = resp.surname;
            document.getElementById('name-change').value = resp.name;
            document.getElementById('lastname-change').value = resp.lastName;
            document.querySelector('.id-change').textContent = `ID: ${resp.id}`;
            const contacts = document.querySelector('.contacts-change');
            for (let i = 0; i < resp.contacts.length; i++) {
                contacts.append(addNewContact());
                const contactValues = document.querySelectorAll('.contact__input');
                const contactTypes = document.querySelectorAll('.contact__type')

                contactTypes[i].textContent = resp.contacts[i].type
                contactValues[i].value = resp.contacts[i].value;

                if (contactTypes[i].textContent !== 'Выберите') {
                    contactValues[i].disabled = false
                }

                if (contactTypes[i].textContent === 'Телефон') {
                    contactValues[i].type = 'number';
                }
                if (contactTypes[i].textContent === 'Email') {
                    contactValues[i].type = 'email';
                }
                if (contactTypes[i].textContent === 'Facebook') {
                    contactValues[i].type = 'text';
                }
                if (contactTypes[i].textContent === 'Vk') {
                    contactValues[i].type = 'text';
                }
                if (contactTypes[i].textContent === 'Другое') {
                    contactValues[i].type = 'text';
                }

                const contactBlock = document.querySelectorAll('.contact');
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('contact__btn');
                deleteBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_224_8066)">
                <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
                </g>
                <defs>
                <clipPath id="clip0_224_8066">
                <rect width="16" height="16" fill="white"/>
                </clipPath>
                </defs>
                </svg>
                `
                contactBlock[i].append(deleteBtn)
                deleteBtn.addEventListener('click', () => {
                    contactBlock[i].remove()
                })
            }
        })
    }



    function createTooltip(type, value) {
        const tooltip = document.createElement('div');
        const tooltipType = document.createElement('span');
        const tooltipValue = document.createElement('a');

        tooltip.classList.add('tooltip')
        tooltipType.classList.add('tooltip-type');
        tooltipValue.classList.add('tooltip-value');

        tooltipType.textContent = type + ': ';
        tooltipValue.textContent = value;

        tooltip.append(tooltipType);
        tooltip.append(tooltipValue);

        if (type == 'Телефон') {
            tooltipValue.classList.add('value-tel')
        };
        return tooltip
    }


    function addContacts() {
        let types = document.querySelectorAll('.contact__type')
        let values = document.querySelectorAll('.contact__input');
        let contactsBlock = document.querySelectorAll('.contact');

        for (let i = 0; i <= contactsBlock.length - 1; i++) {
            contactsArray.push({
                type: types[i].textContent,
                value: values[i].value,
            })
        }
        return contactsArray;
    }


    addPreload()
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();
    if (response.status >= 500) {
        const error = document.createElement('span');
        error.textContent = 'Странно, но сервер сломался :(';
        document.querySelector('.clients__btn-block').append(error);
    }
    clients = data;

    removePreload()

    getFio(clients)

    function renderClients() {
        document.getElementById('clients-list').innerHTML = '';
        if (clients !== '' && clients !== null) {
            for (let client of clients) {
                clientList.append(addNewClient(client));
            }
        }
    }


    renderClients()


    let dir = true


    function sort(arr, prop) {
        console.log(clients)
        let result = arr.sort(function (a, b) {
            let dirIf = a[prop] < b[prop];
            if (dir == true) {
                document.querySelector('.sort-fio-text').textContent = 'А-Я';
                document.querySelector('.arrow-fio').style.transform = 'rotate(360deg)';
                document.querySelector('.arrow-date-create').style.transform = 'rotate(360deg)';
                document.querySelector('.arrow-date-change').style.transform = 'rotate(360deg)';
                dirIf = a[prop] > b[prop]
            }
            if (dirIf == false) return -1;
        });
        dir = !dir;
        return result
    }

    let dirId = false

    function sortId() {
        let result = clients.sort(function (a, b) {
            let dirIf = a['id'] < b['id'];
            if (dirId == true) {
                document.querySelector('.arrow-id').style.transform = 'rotate(360deg)';
                dirIf = a['id'] > b['id']
            }
            if (dirIf == false) return -1;
        });
        dirId = !dirId;
        return result
    }


    search.addEventListener('input', () => {
        if (document.querySelector('.message') !== null)
            document.querySelector('.message').remove();
        clearTimeout(timer)
        timer = setTimeout(() => {
            let resp = searchClients();
            console.log(resp)
            resp.then(resp => {
                document.getElementById('clients-list').innerHTML = '';
                if (resp !== '' && resp !== null) {
                    for (let el of resp) {
                        clientList.append(addNewClient(el));
                    }
                }
            })
        }, 300);
        if (search.value === '') {
            renderClients()
        }

    })



    document.getElementById('sort-id').addEventListener('click', () => {
        document.querySelector('.arrow-id').style.transform = 'rotate(180deg)';
        sortId();
        renderClients();
    })

    document.getElementById('sort-fio').addEventListener('click', () => {
        document.querySelector('.arrow-fio').style.transform = 'rotate(180deg)';
        document.querySelector('.sort-fio-text').textContent = 'Я-А';
        sort(clients, 'fio');
        renderClients();
    })

    document.getElementById('sort-create').addEventListener('click', () => {
        document.querySelector('.arrow-date-create').style.transform = 'rotate(180deg)';
        sort(clients, 'updatedAt');
        renderClients();
    })

    document.getElementById('sort-change').addEventListener('click', () => {
        document.querySelector('.arrow-date-change').style.transform = 'rotate(180deg)';
        sort(clients, 'createdAt');
        renderClients();
    })



})()
