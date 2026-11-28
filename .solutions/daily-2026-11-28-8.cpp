#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    string s;
    cin >> n >> k >> s;
    string st;
    int rem = k;
    for (char c : s) {
        while (rem > 0 && !st.empty() && st.back() < c) {
            st.pop_back();
            rem--;
        }
        st.push_back(c);
    }
    st.resize(n - k);
    cout << st << "\n";
    return 0;
}
