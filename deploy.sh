
#!/bin/bash

# Source utility functions
source ./scripts/utils/colors.sh
source ./scripts/utils/helpers.sh

# Verify requirements before proceeding
check_docker
check_env
create_dirs

# Show main menu
show_menu
