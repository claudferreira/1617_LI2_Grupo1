namespace WindowsFormsApp1
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.btConectar = new System.Windows.Forms.Button();
            this.timerCOM = new System.Windows.Forms.Timer(this.components);
            this.serialPort1 = new System.IO.Ports.SerialPort(this.components);
            this.esp0 = new System.Windows.Forms.RadioButton();
            this.esp50 = new System.Windows.Forms.RadioButton();
            this.esp100 = new System.Windows.Forms.RadioButton();
            this.banco0 = new System.Windows.Forms.RadioButton();
            this.banco50 = new System.Windows.Forms.RadioButton();
            this.banco100 = new System.Windows.Forms.RadioButton();
            this.button1 = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.label3 = new System.Windows.Forms.Label();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            // 
            // btConectar
            // 
            this.btConectar.Location = new System.Drawing.Point(247, 50);
            this.btConectar.Name = "btConectar";
            this.btConectar.Size = new System.Drawing.Size(97, 23);
            this.btConectar.TabIndex = 0;
            this.btConectar.Text = "Conectar Master";
            this.btConectar.UseVisualStyleBackColor = true;
            this.btConectar.Click += new System.EventHandler(this.btConectar_Click);
            // 
            // timerCOM
            // 
            this.timerCOM.Interval = 1000;
            this.timerCOM.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // esp0
            // 
            this.esp0.AutoSize = true;
            this.esp0.Location = new System.Drawing.Point(17, 33);
            this.esp0.Name = "esp0";
            this.esp0.Size = new System.Drawing.Size(31, 17);
            this.esp0.TabIndex = 2;
            this.esp0.TabStop = true;
            this.esp0.Text = "0";
            this.esp0.UseVisualStyleBackColor = true;
            this.esp0.CheckedChanged += new System.EventHandler(this.radioButton1_CheckedChanged);
            // 
            // esp50
            // 
            this.esp50.AutoSize = true;
            this.esp50.Location = new System.Drawing.Point(72, 33);
            this.esp50.Name = "esp50";
            this.esp50.Size = new System.Drawing.Size(37, 17);
            this.esp50.TabIndex = 3;
            this.esp50.TabStop = true;
            this.esp50.Text = "50";
            this.esp50.UseVisualStyleBackColor = true;
            // 
            // esp100
            // 
            this.esp100.AutoSize = true;
            this.esp100.Location = new System.Drawing.Point(127, 33);
            this.esp100.Name = "esp100";
            this.esp100.Size = new System.Drawing.Size(43, 17);
            this.esp100.TabIndex = 4;
            this.esp100.TabStop = true;
            this.esp100.Text = "100";
            this.esp100.UseVisualStyleBackColor = true;
            // 
            // banco0
            // 
            this.banco0.AutoSize = true;
            this.banco0.Location = new System.Drawing.Point(17, 29);
            this.banco0.Name = "banco0";
            this.banco0.Size = new System.Drawing.Size(31, 17);
            this.banco0.TabIndex = 5;
            this.banco0.TabStop = true;
            this.banco0.Text = "0";
            this.banco0.UseVisualStyleBackColor = true;
            // 
            // banco50
            // 
            this.banco50.AutoSize = true;
            this.banco50.Location = new System.Drawing.Point(72, 29);
            this.banco50.Name = "banco50";
            this.banco50.Size = new System.Drawing.Size(37, 17);
            this.banco50.TabIndex = 6;
            this.banco50.TabStop = true;
            this.banco50.Text = "50";
            this.banco50.UseVisualStyleBackColor = true;
            // 
            // banco100
            // 
            this.banco100.AutoSize = true;
            this.banco100.Location = new System.Drawing.Point(127, 29);
            this.banco100.Name = "banco100";
            this.banco100.Size = new System.Drawing.Size(43, 17);
            this.banco100.TabIndex = 7;
            this.banco100.TabStop = true;
            this.banco100.Text = "100";
            this.banco100.UseVisualStyleBackColor = true;
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(247, 124);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 10;
            this.button1.Text = "Enviar";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.esp100);
            this.groupBox1.Controls.Add(this.esp0);
            this.groupBox1.Controls.Add(this.esp50);
            this.groupBox1.Location = new System.Drawing.Point(29, 17);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(200, 71);
            this.groupBox1.TabIndex = 11;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Espelho";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.banco50);
            this.groupBox2.Controls.Add(this.banco0);
            this.groupBox2.Controls.Add(this.banco100);
            this.groupBox2.Location = new System.Drawing.Point(29, 101);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(200, 72);
            this.groupBox2.TabIndex = 12;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Banco";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(244, 160);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(0, 13);
            this.label3.TabIndex = 13;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(358, 192);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.btConectar);
            this.Name = "Form1";
            this.Text = "Teste CAN";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btConectar;
        private System.Windows.Forms.Timer timerCOM;
        private System.IO.Ports.SerialPort serialPort1;
        private System.Windows.Forms.RadioButton esp0;
        private System.Windows.Forms.RadioButton esp50;
        private System.Windows.Forms.RadioButton esp100;
        private System.Windows.Forms.RadioButton banco0;
        private System.Windows.Forms.RadioButton banco50;
        private System.Windows.Forms.RadioButton banco100;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Label label3;
    }
}

