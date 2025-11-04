
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://kvwjlwmhcqvcfzjauwzb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2d2psd21oY3F2Y2Z6amF1d3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjU4NzAsImV4cCI6MjA3Nzg0MTg3MH0.ZLXcvdyNp3o-5kLy4FJaLSVHzAW6b8mCXMM993WAlrE";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);



// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = regEmail.value;
    const password = regPassword.value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Registration successful! Please verify your email.");
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      alert("Login successful!");
      window.location.href = "booking.html";
    }
  });
}

// BOOK APPOINTMENT
const bookForm = document.getElementById("bookForm");
if (bookForm) {
  bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert("Please login first!");
      return;
    }

    const { error } = await supabase.from("appointments").insert([
      {
        user_email: user.email,
        patient_name: patientName.value,
        doctor_name: doctorName.value,
        date: date.value,
        time: time.value,
        reason: reason.value,
      },
    ]);

    if (error) alert(error.message);
    else {
      alert("Appointment booked!");
      window.location.href = "appointments.html";
    }
  });
}

// SHOW APPOINTMENTS
const appointmentsList = document.getElementById("appointmentsList");
if (appointmentsList) {
  (async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert("Please login first!");
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_email", user.email)
      .order("created_at", { ascending: false });

    if (error) alert(error.message);
    else {
      if (data.length === 0) {
        appointmentsList.innerHTML = "<p>No appointments yet.</p>";
      } else {
        appointmentsList.innerHTML = data
          .map(
            (a) => `
          <div class="appointment">
            <p><b>Doctor:</b> ${a.doctor_name}</p>
            <p><b>Date:</b> ${a.date} ${a.time}</p>
            <p><b>Reason:</b> ${a.reason}</p>
          </div>
        `
          )
          .join("");
      }
    }
  })();
}
