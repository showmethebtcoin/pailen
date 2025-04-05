
#!/bin/bash

# Colors for messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to show colored messages
show_message() {
  echo -e "${2}${1}${NC}"
}
