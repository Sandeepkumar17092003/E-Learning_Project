import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

const storageRef = ref(storage, 'files/');
const dbRef = collection(firestore, 'files');

document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.querySelector('#form-container');
    const spinner = document.querySelector('#spinner');

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showSpinner();

        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const description = document.querySelector('#txtarea').value;
        const password = document.querySelector('#password').value;
        const fileInput = document.querySelector('#file_upload');
        const file = fileInput.files[0];

        if (file) {
            try {
                const fileRef = ref(storageRef, file.name);
                await uploadBytes(fileRef, file);
                const fileURL = await getDownloadURL(fileRef);

                await addDoc(dbRef, {
                    owner: name,
                    email: email,
                    description: description,
                    password: password,
                    filename: file.name,
                    fileURL: fileURL,
                    filetype: file.type,
                });

                alert('File uploaded successfully');
                displayFiles(); // Refresh the file list

                // Reset the form
                uploadForm.reset();
                fileInput.value = ''; // Clear the file input field
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('An error occurred while uploading the file');
            } finally {
                hideSpinner();
            }
        } else {
            alert('Please select a file to upload');
            hideSpinner();
        }
    });

    async function displayFiles() {
        const filesTable = document.querySelector('.file-display table tbody');
        filesTable.innerHTML = ''; // Clear existing rows

        try {
            const querySnapshot = await getDocs(dbRef);

            querySnapshot.forEach((fileDoc) => {
                const fileData = fileDoc.data();
                const row = filesTable.insertRow();

                row.insertCell(0).textContent = fileData.owner;
                row.insertCell(1).textContent = fileData.filename;
                row.insertCell(2).textContent = fileData.email;
                row.insertCell(3).textContent = fileData.description;

                const downloadCell = row.insertCell(4);
                const downloadLink = document.createElement('a');
                downloadLink.href = fileData.fileURL;
                downloadLink.target = '_blank'; // Open in a new tab
                downloadLink.title = 'Download';
                downloadLink.innerHTML = '<i class="fas fa-download" style="font-size:15px;"></i>';
                downloadCell.appendChild(downloadLink);

                const actionCell = row.insertCell(5);
                const deleteLink = document.createElement('a');
                deleteLink.href = 'javascript:void(0);';
                deleteLink.onclick = () => confirmDelete(fileDoc.id);
                deleteLink.title = 'Delete';
                deleteLink.innerHTML = '<i class="fas fa-trash" style="font-size:15px;"></i>';
                actionCell.appendChild(deleteLink);
            });
        } catch (error) {
            console.error('Error displaying files:', error);
        }
    }

    window.confirmDelete = async function (docId) {
        const password = prompt('Enter your password to delete the file:');
        showSpinner();

        try {
            const fileDocRef = doc(firestore, 'files', docId);
            const fileDoc = await getDoc(fileDocRef);

            if (fileDoc.exists()) {
                const fileData = fileDoc.data();
                if (password === "Sandeep80772@" || password === fileData.password) {
                    await deleteFile(docId);
                } else {
                    alert('Incorrect password');
                }
            } else {
                alert('File does not exist');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('An error occurred while deleting the file');
        } finally {
            hideSpinner();
        }
    };

    async function deleteFile(docId) {
        try {
            const fileDocRef = doc(firestore, 'files', docId);
            const fileDoc = await getDoc(fileDocRef);

            if (fileDoc.exists()) {
                const fileData = fileDoc.data();
                const fileURL = fileData.fileURL;

                const filePath = fileURL.split('/o/')[1].split('?')[0];
                const fileRef = ref(storage, decodeURIComponent(filePath));

                await deleteObject(fileRef);
                await deleteDoc(fileDocRef);

                alert('File deleted successfully');
                displayFiles(); // Refresh the file list
            } else {
                alert('File does not exist');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('An error occurred while deleting the file');
        }
    }

    function showSpinner() {
        spinner.style.display = 'flex';
    }

    function hideSpinner() {
        spinner.style.display = 'none';
    }

    displayFiles(); // Initial call to display files on page load
});
