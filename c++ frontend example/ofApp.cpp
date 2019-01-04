#include "ofApp.h"
#include <ctime>

void ofApp::setup(){
    
    ofSetVerticalSync(true);
    ofSetFrameRate(60);
    ofSetWindowShape(1920, 1080);
    
    //set variables for phone number
    phone_num = "15515741476"; //8613261962061
    
    //domain and host of the server we need to hit
    url_string = "http://localhost:3002";
    
    //path to the api from the domain
    api_path = "/api/send-text";
    
    //load placeholder image
    placeholderImg.load("images/ikea.jpg");
}

void ofApp::update(){
    
}

void ofApp::draw(){
    
    // draw place holder image for demo purposes
    placeholderImg.draw(0,0);
    
    //animate ball to show processing status of app
    float y = 50 + 20 * sinf( 0.1 * ofGetFrameNum() );
    ofDrawCircle(22, y, 20);
}


void ofApp::keyPressed(int key){
    
    if( key == 'p' ){
        
        // Take a screenshot of the current openFrameworks app
        //screenImg.allocate(ofGetWidth(), ofGetHeight(), OF_IMAGE_COLOR);
        screenImg.grabScreen(0, 0, ofGetWidth(), ofGetHeight());
        
        //save image into local and to cloud too
        // this would take a second
        saveLocalImage(screenImg);
        
        
        textImage(screenImg, phone_num);
    }
}


/**
Create HTTP Post for sending image data to Twillio
 */
void ofApp::textImage(ofImage &inImage, string &inPhoneNum){
    
    //create ssl context when ssl is needed
    const Context::Ptr context( new Context( Context::CLIENT_USE, "", "", "", Context::VERIFY_NONE) );
    Poco::URI uri(url_string);
    // Create a client session and request object for http://localhost:3002
    HTTPClientSession* session;
    
    //check for 'https' in url string and load HTTPS Client session when needed
    if(url_string.find("https")==0) {
        session = new HTTPSClientSession(uri.getHost(), uri.getPort(), context);
    } else {
        session = new HTTPClientSession(uri.getHost(), uri.getPort());
    }
    Poco::Net::HTTPRequest request;
    request.setMethod(Poco::Net::HTTPRequest::HTTP_POST);
    request.setURI(api_path);
    request.setContentType("application/x-www-form-urlencoded");
    
    // Create a new HTMLForm to submit to and add data
    Poco::Net::HTMLForm form;
    form.add("phoneNumber", inPhoneNum);
    
    // create buffer to hold base64 data
    ofBuffer buffer;
    stringstream ss;
    ofSaveImage(inImage.getPixels(), buffer, OF_IMAGE_FORMAT_PNG, OF_IMAGE_QUALITY_BEST);
    
    // Convert the binary image data to string using base64 encoding
    ss.str("");
    Poco::Base64Encoder b64enc(ss);
    b64enc << buffer;
    b64enc.close();
    
    // Add the encodeded image data to the form
    string base64Str = ss.str();
    removeCRLF(base64Str);
    form.add("imgData", base64Str);
    
    // Fill out the request object and write to output stream
    form.prepareSubmit(request);
    ostream& send = session->sendRequest(request);
    session->setTimeout(Poco::Timespan(20, 0));
    form.write(send);
    
    // Get and print out the response from the server
    Poco::Net::HTTPResponse response;
    istream& res = session->receiveResponse(response);
    ostringstream stream;
    Poco::StreamCopier::copyStream(res, stream);
    cout << stream.str() << endl;
    cout << "" << endl;
}


/**
 * Save a version of the poster locally
 * @param {ofImage} screenshot - Image to be saved locally
 */
void ofApp::saveLocalImage(ofImage &screenshot){
    time_t rawtime;
    struct tm * timeinfo;
    char buffer[80];
    
    time (&rawtime);
    timeinfo = gmtime(&rawtime);
    
    strftime(buffer,sizeof(buffer),"%Y-%m-%d-%H%M%S",timeinfo);
    string str(buffer);
    
    string fileName = "poster_"+str+".png";
    screenshot.save(fileName);
}

/**
 * Format the base64 string to remove carriage returns and new line chars
 * @param {string} targetStr - Image to be saved locally
 */
void ofApp::removeCRLF(string &targetStr){
    const char CR = '\r';
    const char LF = '\n';
    string str;
    for (const auto c : targetStr) {
        if (c != CR && c != LF) {
            str += c;
        }
    }
    targetStr = std::move(str);
}

