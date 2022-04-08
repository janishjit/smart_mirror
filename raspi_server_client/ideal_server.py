import json
from flask import Flask, request, send_file
import torch
import torchaudio
import numpy as np
import subprocess

app = Flask(__name__)
@app.route('/', methods=['GET', 'POST'])
def run_model():
    raw_file = request.files.get('file')
    raw_file.save('audioj.bin')
    binary_file = 'audioj.bin'
    wav_file = 'speechj.wav'
   
    # raw-&gt;wav command
    cmd = "sox -t raw -r 48k -e signed -b 32 -L -c 1 " + binary_file + " " + wav_file
   
    # Execute command
    subprocess.check_output (cmd, shell = True)
   
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
       
    model = torch.load('model.pt').to(device)

    waveform, sample_rate = torchaudio.load(wav_file)

    waveform = torchaudio.functional.resample(waveform, sample_rate, 16000)
   
    waveform = waveform.to(device)
   
    waveform = waveform * 10
   
    with torch.inference_mode():
        emission, _ = model(waveform)
   
    output = torch.nn.functional.relu(emission[0]).byte()
   
    np.savetxt("outtensor.txt", output.numpy().flatten(order='C'), delimiter =", ")
   
    return send_file("outtensor.txt")
   
app.run(host="169.254.238.233")