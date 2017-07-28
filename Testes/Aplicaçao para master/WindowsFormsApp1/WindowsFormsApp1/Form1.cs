using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO.Ports;

namespace WindowsFormsApp1
{
    public partial class Form1 : Form
    {
        SerialPort master = new SerialPort("COM12", 115200);
        String esp = "";
        String banco = "";
        String enviar = "";
        public Form1()
        {
            InitializeComponent();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {

        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void btConectar_Click(object sender, EventArgs e)
        {
            master.Open();
            label3.Text = "Conectado na COM12";
        }

        private void radioButton1_CheckedChanged(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            if(esp0.Checked){esp = "esp0";}
            if (esp50.Checked){esp = "esp50";}
            if (esp100.Checked){esp = "esp100";}

            if(banco0.Checked){banco = "banco0";}
            if (banco50.Checked){banco = "banco50";}
            if (banco100.Checked){banco = "banco100";}

            enviar = esp + "_" + banco;
            master.Write(enviar);
            label3.Text = enviar;
        }
    }
}
