import pycurl

c = pycurl.Curl()
c.setopt(c.URL, 'http://169.254.238.233:5000/')
c.setopt(c.POST, 1)
c.setopt(c.HTTPPOST, [("file", (c.FORM_FILE, "audio.bin"))])

output = c.perform()
c.close()

