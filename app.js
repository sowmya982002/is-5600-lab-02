function populateForm(data) {
  if (!data) return;

  const { user, id } = data;

  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

function viewStock(symbol, stocks) {
  const stock = stocks.find((s) => s.symbol == symbol);
  if (!stock) return;

  document.querySelector('#stockName').textContent = stock.name || '';
  document.querySelector('#stockSector').textContent = stock.sector || '';
  document.querySelector('#stockIndustry').textContent = stock.subIndustry || '';
  document.querySelector('#stockAddress').textContent = stock.address || '';

  const logo = document.querySelector('#logo');
  if (logo) {
    logo.src = `logos/${symbol}.svg`;
    logo.alt = `${symbol} logo`;
  }
}

function renderPortfolio(user, stocks) {
  const portfolioDetails = document.querySelector('.portfolio-list');
  if (!portfolioDetails) return;

  portfolioDetails.innerHTML = '';

  if (!user || !user.portfolio) return;

  user.portfolio.forEach(({ symbol, owned }) => {
    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const actionEl = document.createElement('button');

    symbolEl.textContent = symbol;
    sharesEl.textContent = owned;
    actionEl.textContent = 'View';
    actionEl.setAttribute('id', symbol);

    portfolioDetails.appendChild(symbolEl);
    portfolioDetails.appendChild(sharesEl);
    portfolioDetails.appendChild(actionEl);
  });

  portfolioDetails.onclick = function (event) {
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  };
}

function handleUserListClick(event, users, stocks) {
  const userId = event.target.id;
  if (!userId) return;

  const selectedUser = users.find((u) => u.id == userId);
  if (!selectedUser) return;

  populateForm(selectedUser);
  renderPortfolio(selectedUser, stocks);
}

function generateUserList(users, stocks) {
  const userList = document.querySelector('.user-list');
  if (!userList) return;

  userList.innerHTML = '';

  users.forEach(({ user, id }) => {
    const listItem = document.createElement('li');
    listItem.innerText = `${user.lastname}, ${user.firstname}`;
    listItem.setAttribute('id', id);
    userList.appendChild(listItem);
  });

  userList.onclick = function (event) {
    handleUserListClick(event, users, stocks);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  generateUserList(userData, stocksData);

  const saveButton = document.querySelector('#save');
  const deleteButton = document.querySelector('#delete');

  if (saveButton) {
    saveButton.addEventListener('click', (event) => {
      event.preventDefault();

      const id = document.querySelector('#userID').value;

      for (let i = 0; i < userData.length; i++) {
        if (userData[i].id == id) {
          userData[i].user.firstname = document.querySelector('#firstname').value;
          userData[i].user.lastname = document.querySelector('#lastname').value;
          userData[i].user.address = document.querySelector('#address').value;
          userData[i].user.city = document.querySelector('#city').value;
          userData[i].user.email = document.querySelector('#email').value;

          generateUserList(userData, stocksData);
          populateForm(userData[i]);
          renderPortfolio(userData[i], stocksData);
          break;
        }
      }
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', (event) => {
      event.preventDefault();

      const userId = document.querySelector('#userID').value;
      const userIndex = userData.findIndex((user) => user.id == userId);

      if (userIndex !== -1) {
        userData.splice(userIndex, 1);
      }

      generateUserList(userData, stocksData);

      document.querySelector('#userID').value = '';
      document.querySelector('#firstname').value = '';
      document.querySelector('#lastname').value = '';
      document.querySelector('#address').value = '';
      document.querySelector('#city').value = '';
      document.querySelector('#email').value = '';

      const portfolioDetails = document.querySelector('.portfolio-list');
      if (portfolioDetails) portfolioDetails.innerHTML = '';

      document.querySelector('#stockName').textContent = '';
      document.querySelector('#stockSector').textContent = '';
      document.querySelector('#stockIndustry').textContent = '';
      document.querySelector('#stockAddress').textContent = '';

      const logo = document.querySelector('#logo');
      if (logo) {
        logo.src = '';
        logo.alt = '';
      }
    });
  }
});