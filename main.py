from google.appengine.api import users
import jinja2
import json
import os
import webapp2

#set up environment for Jinja
#this sets jinja's relative directory to match the directory name(dirname) of
#the current __file__, in this case, main.py
jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class MainHandler(webapp2.RequestHandler):
    def get(self):
	user = users.get_current_user();
	if user:
	    userData = {
		'signedIn':true,
		'name':user.nickname(),
		'signOutUrl':user.create_logout_url('/')
	    }
	else:
	    userData = {
		'signedIn':false
		'signInUrl':user.create_login_url('/')
	    }
        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render({'user':userData))

# creates a WSGIApplication and assigns it to the variable app.
app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
