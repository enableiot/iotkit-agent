# iotkit-agent

The IoT Kit Agent abstract cloud connectivity complexities. It allows developers to focus on application developments and interacting with I/O devices (sensors, actuators and tags). The local IoT Kit Agent when sending data to the cloud transparently implements the necessary message formats and transport security as well as device registration.

![Agent Topology](../master/images/agent-topo.png?raw=true)


## Installation

Clone the iotkit-agent project:
    
    git clone https://github.com/enableiot/iotkit-agent.git
    
Or simply download zip of the latest version:

    wget -O iotkit-agent.zip https://github.com/enableiot/iotkit-agent/archive/master.zip | unzip iotkit-agent.zip
    
> Note, this will not work until the iotkit-agent repo is open
    
Once you have a copy of the iotkit-agent locally, execute the setup script:

    cd iotkit-agent
    ./setup-agent.sh
    
> You only have to run the setup once
    
### Configuration

The `iotkit-agent`, by default, has sufficient defaults to register itself in the Cloud.
    
> You can configure many parameters of the iotkit-agent in the `config.json` file located in the root folder, but, unless you are sure you know what they mean, these are best left unchanged.
        
### Start

To start the agent service simply execute the `start-agent.sh` file:

    ./start-agent.sh
    
### Stop

    ./stop-agent.sh

## Usage

For instructions how to use the `iotkit-agent` please the [iotkit-samples repo](https://github.com/enableiot/iotkit-samples).

## License

Copyright (c) 2013, enableiot.com
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
